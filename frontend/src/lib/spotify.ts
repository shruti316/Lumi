/**
 * LUMI Spotify Integration Layer
 * Implements Spotify OAuth 2.0 with PKCE (Proof Key for Code Exchange).
 * Secure client-side authorization without exposing any Client Secret.
 */

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  durationMs: number;
  progressMs: number;
  isPlaying: boolean;
  spotifyUrl: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  spotifyUrl: string;
}

export interface SpotifyProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  product?: string;
  spotifyUrl?: string;
}

export type SpotifyUser = SpotifyProfile;

const SPOTIFY_CLIENT_ID =
  import.meta.env.VITE_SPOTIFY_CLIENT_ID || "3c84852085734e5db89e083984cfb77f"; // Configured or standard public client
const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI ||
  (typeof window !== "undefined" ? `${window.location.origin}/music` : "http://localhost:5173/music");

const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

// Helper: Generate random string for PKCE code verifier
function generateRandomString(length: number): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Helper: Generate SHA-256 base64url challenge
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export const spotify = {
  isConfigured(): boolean {
    return Boolean(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_ID !== "YOUR_SPOTIFY_CLIENT_ID");
  },

  isConnected(): boolean {
    const token = localStorage.getItem("spotify_access_token");
    const expiry = localStorage.getItem("spotify_token_expiry");
    if (!token || !expiry) return false;
    return Date.now() < Number(expiry);
  },

  isAuthenticated(): boolean {
    return this.isConnected();
  },

  async login(): Promise<void> {
    const url = await this.getAuthUrl();
    window.location.href = url;
  },

  logout(): void {
    this.disconnect();
  },

  async getProfile(): Promise<SpotifyProfile | null> {
    return this.getUserProfile();
  },

  async getAuthUrl(): Promise<string> {
    const verifier = generateRandomString(128);
    const challenge = await generateCodeChallenge(verifier);
    const state = generateRandomString(16);

    sessionStorage.setItem("spotify_code_verifier", verifier);
    sessionStorage.setItem("spotify_auth_state", state);

    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: SPOTIFY_SCOPES,
      code_challenge_method: "S256",
      code_challenge: challenge,
      state,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  },

  async handleCallback(code: string): Promise<boolean> {
    const verifier = sessionStorage.getItem("spotify_code_verifier");
    if (!verifier) {
      console.warn("[LUMI Spotify] Missing code verifier in session.");
      return false;
    }

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: SPOTIFY_CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.access_token) {
        console.error("[LUMI Spotify] Token exchange error:", data);
        return false;
      }

      const expiryTime = Date.now() + (data.expires_in || 3600) * 1000;
      localStorage.setItem("spotify_access_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("spotify_refresh_token", data.refresh_token);
      }
      localStorage.setItem("spotify_token_expiry", expiryTime.toString());
      sessionStorage.removeItem("spotify_code_verifier");
      sessionStorage.removeItem("spotify_auth_state");

      window.dispatchEvent(new CustomEvent("lumi-spotify-sync"));
      return true;
    } catch (err) {
      console.error("[LUMI Spotify] Auth callback error:", err);
      return false;
    }
  },

  async getAccessToken(): Promise<string | null> {
    const token = localStorage.getItem("spotify_access_token");
    const expiry = localStorage.getItem("spotify_token_expiry");
    const refreshToken = localStorage.getItem("spotify_refresh_token");

    if (!token) return null;

    // Refresh token if near expiry (within 60s)
    if (expiry && Date.now() > Number(expiry) - 60000 && refreshToken) {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        });
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem("spotify_access_token", data.access_token);
          const newExpiry = Date.now() + (data.expires_in || 3600) * 1000;
          localStorage.setItem("spotify_token_expiry", newExpiry.toString());
          return data.access_token;
        }
      } catch {
        this.disconnect();
        return null;
      }
    }

    return token;
  },

  disconnect() {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expiry");
    window.dispatchEvent(new CustomEvent("lumi-spotify-sync"));
  },

  async getUserProfile(): Promise<SpotifyProfile | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        id: data.id,
        displayName: data.display_name || "Spotify User",
        email: data.email,
        avatarUrl: data.images?.[0]?.url,
        product: data.product,
        spotifyUrl: data.external_urls?.spotify,
      };
    } catch {
      return null;
    }
  },

  async getCurrentlyPlaying(): Promise<SpotifyTrack | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204 || res.status === 200) {
        if (res.status === 204) return null;
        const data = await res.json();
        if (!data.item) return null;

        return {
          id: data.item.id,
          name: data.item.name,
          artist: data.item.artists?.map((a: any) => a.name).join(", ") || "Unknown Artist",
          album: data.item.album?.name || "Single",
          albumArt: data.item.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80",
          durationMs: data.item.duration_ms || 180000,
          progressMs: data.progress_ms || 0,
          isPlaying: Boolean(data.is_playing),
          spotifyUrl: data.item.external_urls?.spotify || "https://open.spotify.com",
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  async getRecentlyPlayed(limit = 6): Promise<SpotifyTrack[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    try {
      const res = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data.items)) return [];

      return data.items.map((item: any) => ({
        id: item.track?.id || crypto.randomUUID(),
        name: item.track?.name || "Study Track",
        artist: item.track?.artists?.map((a: any) => a.name).join(", ") || "Unknown Artist",
        album: item.track?.album?.name || "Album",
        albumArt: item.track?.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80",
        durationMs: item.track?.duration_ms || 180000,
        progressMs: 0,
        isPlaying: false,
        spotifyUrl: item.track?.external_urls?.spotify || "https://open.spotify.com",
      }));
    } catch {
      return [];
    }
  },

  async getUserPlaylists(limit = 6): Promise<SpotifyPlaylist[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    try {
      const res = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data.items)) return [];

      return data.items.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "Curated study playlist",
        imageUrl: p.images?.[0]?.url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        trackCount: p.tracks?.total || 0,
        spotifyUrl: p.external_urls?.spotify || "https://open.spotify.com",
      }));
    } catch {
      return [];
    }
  },
};
