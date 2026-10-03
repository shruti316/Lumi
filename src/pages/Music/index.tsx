import { useState } from "react";
import { Headphones, Sparkles, ExternalLink, Music2, Info } from "lucide-react";
import { Card } from "../../components/ui/Card";

export default function Music() {
  const [showConnectNotice, setShowConnectNotice] = useState(false);

  return (
    <div className="min-h-screen pb-24 text-[#16131F]">
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4A3F4B] flex items-center gap-1.5">
            <Music2 size={14} /> Soundscapes & Audio Hub 🎧
          </p>
          <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#16131F] sm:text-5xl">
            Music & Playlists
          </h1>
          <p className="font-caveat text-xl text-[#806C79]">
            Your personal soundtrack for study sessions, focus sprints & relaxed evenings.
          </p>
        </header>

        {/* ═══════════════════════════════════════
            SPOTIFY-READY HERO CARD
        ═══════════════════════════════════════ */}
        <Card className="relative overflow-hidden !bg-gradient-to-br !from-[#DAD4DF] !via-[#F4F0EB] !to-[#DDEAF0] !border-[#BAB0C8] p-8 text-center shadow-sm glow-lavender mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1DB954]/10 text-3xl border border-[#1DB954]/20 shadow-2xs">
            🎧
          </div>

          <span className="rounded-full bg-white/80 border border-[#BAB0C8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#4A3F4B]">
            Spotify Integration Ready
          </span>

          <h2 className="font-caveat text-3xl font-bold text-[#16131F] mt-3 sm:text-4xl">
            Your music, your way.
          </h2>

          <p className="mt-2 text-xs max-w-md mx-auto font-medium text-[#806C79] leading-relaxed">
            Connect Spotify to bring your personal study playlists, lo-fi beats, ambient soundscapes, and favorite albums directly into your LUMI Life OS.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowConnectNotice(true)}
              className="flex items-center gap-2 rounded-2xl bg-[#1DB954] px-6 py-3 text-xs font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#1aa34a] active:scale-95"
            >
              <Headphones size={16} />
              <span>Connect Spotify</span>
            </button>

            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-2xl border border-[#BAB0C8] bg-white px-5 py-3 text-xs font-bold text-[#16131F] shadow-2xs transition hover:bg-[#F4F0EB]"
            >
              <span>Open Spotify Web</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {showConnectNotice && (
            <div className="mt-5 rounded-2xl bg-white/80 border border-[#BAB0C8] p-3.5 max-w-md mx-auto text-xs text-[#806C79] flex items-start gap-2.5 text-left animate-fade-up">
              <Info size={16} className="text-[#4A3F4B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#16131F]">Spotify OAuth Architecture Ready</p>
                <p className="text-[11px] mt-0.5">
                  Spotify API credentials & OAuth login will be connected securely when the backend service is deployed.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* ═══════════════════════════════════════
            RECOMMENDED COLLEGE AUDIO ATMOSPHERES
        ═══════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-1 text-[11px] font-extrabold uppercase tracking-wider text-[#4A3F4B]">
            <Sparkles size={13} /> Study Vibe Profiles
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="!bg-white/90 !border-[#DAD4DF] p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">☕</span>
                <h3 className="font-bold text-xs text-[#16131F]">Lo-Fi Study Beats</h3>
              </div>
              <p className="text-[11px] text-[#806C79] leading-relaxed">
                Chill beats & mellow instrumentals to keep you calm during long problem-solving sessions.
              </p>
            </Card>

            <Card className="!bg-white/90 !border-[#DAD4DF] p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌧️</span>
                <h3 className="font-bold text-xs text-[#16131F]">Library Rain Ambient</h3>
              </div>
              <p className="text-[11px] text-[#806C79] leading-relaxed">
                Soft gentle rainfall, fireplace sounds, and cozy campus library room acoustics.
              </p>
            </Card>

            <Card className="!bg-white/90 !border-[#DAD4DF] p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚡</span>
                <h3 className="font-bold text-xs text-[#16131F]">Deep Flow Synth</h3>
              </div>
              <p className="text-[11px] text-[#806C79] leading-relaxed">
                Binaural waves and rhythmic electronic soundscapes designed for fast coding and deep focus sprints.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
