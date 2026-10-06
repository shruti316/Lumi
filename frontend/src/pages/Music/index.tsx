import { useState, useEffect } from "react";
import { Headphones, Sparkles, ExternalLink, Music2, CheckCircle2, Play, Pause, LogOut, Radio } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { spotify, type SpotifyTrack, type SpotifyProfile, type SpotifyPlaylist } from "../../lib/spotify";

export default function Music() {
  const [isConnected, setIsConnected] = useState<boolean>(() => spotify.isConnected());
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  // Handle OAuth PKCE Redirect Callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      setConnecting(true);
      spotify.handleCallback(code).then((success) => {
        setConnecting(false);
        if (success) {
          setIsConnected(true);
          // Clean URL without reload
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }
  }, []);

  // Fetch Spotify Data when connected
  useEffect(() => {
    async function loadSpotifyData() {
      if (!spotify.isConnected()) {
        setIsConnected(false);
        return;
      }

      const [userProf, liveTrack, recents, userPlaylists] = await Promise.all([
        spotify.getUserProfile(),
        spotify.getCurrentlyPlaying(),
        spotify.getRecentlyPlayed(6),
        spotify.getUserPlaylists(6),
      ]);

      if (userProf) setProfile(userProf);
      if (liveTrack) setCurrentTrack(liveTrack);
      if (recents.length > 0) setRecentTracks(recents);
      if (userPlaylists.length > 0) setPlaylists(userPlaylists);
      setIsConnected(true);
    }

    loadSpotifyData();
    window.addEventListener("lumi-spotify-sync", loadSpotifyData);
    return () => window.removeEventListener("lumi-spotify-sync", loadSpotifyData);
  }, [isConnected]);

  async function handleConnectSpotify() {
    setConnecting(true);
    const authUrl = await spotify.getAuthUrl();
    window.location.href = authUrl;
  }

  function handleDisconnect() {
    spotify.disconnect();
    setIsConnected(false);
    setProfile(null);
    setCurrentTrack(null);
    setRecentTracks([]);
    setPlaylists([]);
  }

  // Fallback demo track when disconnected
  const displayTrack: SpotifyTrack = currentTrack || {
    id: "demo-1",
    name: "Snooze (Acoustic Study)",
    artist: "SZA",
    album: "SOS (Night Edition)",
    albumArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80",
    durationMs: 200000,
    progressMs: 65000,
    isPlaying: isPlayingPreview,
    spotifyUrl: "https://open.spotify.com",
  };

  const progressPercent = Math.round((displayTrack.progressMs / (displayTrack.durationMs || 1)) * 100) || 35;

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9E96D8]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792] flex items-center gap-1.5">
              <Music2 size={14} className="text-[#9E96D8]" /> Soundscapes & Audio Hub
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
                Music & <span className="font-editorial-italic font-normal text-[#9E96D8]">Soundscapes</span>
              </h1>
              <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
                Your personal soundtrack for study sessions, focus sprints & relaxed evenings.
              </p>
            </div>

            {isConnected && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#8D8792] hover:text-[#D99BB8] hover:bg-[#FAF8FC] transition cursor-pointer self-start sm:self-center shadow-2xs"
                title="Disconnect Spotify Session"
              >
                <LogOut size={13} />
                <span>Disconnect</span>
              </button>
            )}
          </div>
        </header>

        {/* ═══════════════════════════════════════
            SPOTIFY HERO / LIVE PLAYER CARD
        ═══════════════════════════════════════ */}
        <Card
          variant="mixed"
          hoverEffect
          className="relative overflow-hidden p-6 sm:p-8 border-[#DDD8F2] shadow-sm mb-7 bg-white/95"
        >
          {isConnected ? (
            <div>
              {/* Connected Header Banner */}
              <div className="flex items-center justify-between border-b border-[#E8E3F0] pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1DB954] text-white shadow-2xs font-bold text-base">
                    🎧
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-[#17151C]">
                        {profile?.displayName || "Spotify Connected"}
                      </h3>
                      <span className="flex items-center gap-1 rounded-full bg-[#EEF8F4] border border-[#CCE5DC] px-2 py-0.5 text-[10px] font-bold text-[#3E7D5C]">
                        <CheckCircle2 size={11} /> Connected
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8D8792]">
                      {profile?.product ? `${profile.product.toUpperCase()} Account` : "Live Spotify Streaming Ready"}
                    </p>
                  </div>
                </div>

                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#1DB954] hover:underline"
                >
                  <span>Open App</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Now Playing Live Display */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={displayTrack.albumArt}
                  alt={displayTrack.name}
                  className="h-32 w-32 rounded-2xl object-cover shadow-md border border-[#E8E3F0] shrink-0"
                />

                <div className="min-w-0 flex-1 text-center sm:text-left w-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9E96D8]">
                    {currentTrack?.isPlaying ? "Now Playing" : "Selected Audio"}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17151C] truncate mt-1">
                    {displayTrack.name}
                  </h2>
                  <p className="text-sm font-medium text-[#5F5965] truncate mt-0.5">
                    {displayTrack.artist} • <span className="text-[#8D8792]">{displayTrack.album}</span>
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-[#EEEAFE]">
                      <div
                        className="h-full rounded-full bg-[#1DB954] transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
                    <a
                      href={displayTrack.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-[#1DB954] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1aa34a] transition cursor-pointer"
                    >
                      <Play size={14} className="fill-white" />
                      <span>Play in Spotify</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsPlayingPreview((prev) => !prev)}
                      className="flex items-center gap-1.5 rounded-xl border border-[#E8E3F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#17151C] shadow-2xs hover:bg-[#FAF8FC] transition cursor-pointer"
                    >
                      {isPlayingPreview ? <Pause size={13} /> : <Play size={13} />}
                      <span>{isPlayingPreview ? "Pause Vibe" : "Preview Vibe"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1DB954]/15 text-3xl border border-[#1DB954]/25 shadow-2xs">
                🎧
              </div>

              <span className="rounded-full bg-white/90 border border-[#E8E3F0] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5F5965] shadow-2xs">
                Spotify Integration Ready
              </span>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#17151C] mt-3 tracking-tight">
                Your music, your way.
              </h2>

              <p className="mt-2 text-xs max-w-md mx-auto font-normal text-[#5F5965] leading-relaxed">
                Connect Spotify to bring your personal study playlists, lo-fi beats, ambient soundscapes, and favorite albums directly into your LUMI Life OS.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleConnectSpotify}
                  disabled={connecting}
                  className="flex items-center gap-2 rounded-xl bg-[#1DB954] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#1aa34a] active:scale-95 cursor-pointer disabled:opacity-75"
                >
                  <Headphones size={16} />
                  <span>{connecting ? "Connecting..." : "Connect Spotify"}</span>
                </button>

                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-[#E8E3F0] bg-white px-5 py-2.5 text-xs font-semibold text-[#17151C] shadow-2xs transition hover:bg-[#EEEAFE] cursor-pointer"
                >
                  <span>Open Spotify Web</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}
        </Card>

        {/* ═══════════════════════════════════════
            CONNECTED SPOTIFY PLAYLISTS & RECENTS
        ═══════════════════════════════════════ */}
        {isConnected && (playlists.length > 0 || recentTracks.length > 0) && (
          <div className="space-y-6 mb-8">
            {playlists.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-[#8D8792]">
                  <Music2 size={13} className="text-[#1DB954]" /> Your Spotify Playlists
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {playlists.map((pl) => (
                    <a
                      key={pl.id}
                      href={pl.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-2xl bg-white p-3 border border-[#E8E3F0] hover:border-[#1DB954] hover:shadow-sm transition"
                    >
                      <img
                        src={pl.imageUrl}
                        alt={pl.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80";
                        }}
                        className="h-28 w-full rounded-xl object-cover mb-2"
                      />
                      <p className="text-xs font-bold text-[#17151C] truncate group-hover:text-[#1DB954]">{pl.name}</p>
                      <p className="text-[10px] text-[#8D8792]">{pl.trackCount} tracks</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {recentTracks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-[#8D8792]">
                  <Headphones size={13} className="text-[#9E96D8]" /> Recently Played
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {recentTracks.map((tr) => (
                    <a
                      key={tr.id}
                      href={tr.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E8E3F0] hover:border-[#9E96D8] transition shadow-2xs"
                    >
                      <img
                        src={tr.albumArt}
                        alt={tr.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80";
                        }}
                        className="h-12 w-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#17151C] truncate">{tr.name}</p>
                        <p className="text-[11px] text-[#5F5965] truncate">{tr.artist}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════
            RECOMMENDED STUDY AUDIO ATMOSPHERES
        ═══════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-[#8D8792]">
            <Sparkles size={13} className="text-[#9E96D8]" /> Study Vibe Profiles
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <a
              href="https://open.spotify.com/genre/lo-fi"
              target="_blank"
              rel="noreferrer"
              className="block group"
            >
              <Card variant="glass" hoverEffect className="p-5 border-[#E8E3F0] bg-white/90 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">☕</span>
                    <Radio size={14} className="text-[#8D8792] group-hover:text-[#1DB954] transition" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#17151C]">Lo-Fi Study Beats</h3>
                  <p className="mt-1 text-xs text-[#5F5965] leading-relaxed">
                    Chill beats & mellow instrumentals to keep you calm during long problem-solving sessions.
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-semibold text-[#9E96D8] group-hover:underline">Listen on Spotify →</span>
              </Card>
            </a>

            <a
              href="https://open.spotify.com/genre/ambient"
              target="_blank"
              rel="noreferrer"
              className="block group"
            >
              <Card variant="glass" hoverEffect className="p-5 border-[#E8E3F0] bg-white/90 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">🌧️</span>
                    <Radio size={14} className="text-[#8D8792] group-hover:text-[#1DB954] transition" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#17151C]">Library Rain Ambient</h3>
                  <p className="mt-1 text-xs text-[#5F5965] leading-relaxed">
                    Soft gentle rainfall, fireplace sounds, and cozy campus library room acoustics.
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-semibold text-[#9E96D8] group-hover:underline">Listen on Spotify →</span>
              </Card>
            </a>

            <a
              href="https://open.spotify.com/genre/focus"
              target="_blank"
              rel="noreferrer"
              className="block group"
            >
              <Card variant="glass" hoverEffect className="p-5 border-[#E8E3F0] bg-white/90 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">⚡</span>
                    <Radio size={14} className="text-[#8D8792] group-hover:text-[#1DB954] transition" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#17151C]">Deep Flow Synth</h3>
                  <p className="mt-1 text-xs text-[#5F5965] leading-relaxed">
                    Binaural waves and rhythmic electronic soundscapes designed for fast coding sprints.
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-semibold text-[#9E96D8] group-hover:underline">Listen on Spotify →</span>
              </Card>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
