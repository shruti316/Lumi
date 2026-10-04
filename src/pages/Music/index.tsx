import { useState } from "react";
import { Headphones, Sparkles, ExternalLink, Music2, Info } from "lucide-react";
import { Card } from "../../components/ui/Card";

export default function Music() {
  const [showConnectNotice, setShowConnectNotice] = useState(false);

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
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
            Music & <span className="font-editorial-italic font-normal text-[#9E96D8]">Soundscapes</span>
          </h1>
          <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
            Your personal soundtrack for study sessions, focus sprints & relaxed evenings.
          </p>
        </header>

        {/* ═══════════════════════════════════════
            SPOTIFY-READY HERO CARD
        ═══════════════════════════════════════ */}
        <Card
          variant="mixed"
          hoverEffect
          className="relative overflow-hidden p-8 text-center border-[#DDD8F2] shadow-sm mb-7"
        >
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
              onClick={() => setShowConnectNotice(true)}
              className="flex items-center gap-2 rounded-xl bg-[#1DB954] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#1aa34a] active:scale-95 cursor-pointer"
            >
              <Headphones size={16} />
              <span>Connect Spotify</span>
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

          {showConnectNotice && (
            <div className="mt-5 rounded-2xl bg-white/90 border border-[#E8E3F0] p-4 max-w-md mx-auto text-xs text-[#5F5965] flex items-start gap-3 text-left lumi-animate-fade-up shadow-2xs">
              <Info size={16} className="text-[#9E96D8] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#17151C]">Spotify OAuth Architecture Ready</p>
                <p className="text-[11px] mt-0.5 leading-relaxed">
                  Spotify API credentials & OAuth authentication will be connected seamlessly in the upcoming backend service phase.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* ═══════════════════════════════════════
            RECOMMENDED STUDY AUDIO ATMOSPHERES
        ═══════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-[#8D8792]">
            <Sparkles size={13} className="text-[#9E96D8]" /> Study Vibe Profiles
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Card variant="glass" hoverEffect className="p-5 border-[#E8E3F0] bg-white/90">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">☕</span>
                <h3 className="font-serif font-bold text-sm text-[#17151C]">Lo-Fi Study Beats</h3>
              </div>
              <p className="text-xs text-[#5F5965] leading-relaxed">
                Chill beats & mellow instrumentals to keep you calm during long problem-solving sessions.
              </p>
            </Card>

            <Card variant="glass" hoverEffect className="p-5 border-[#E8E3F0] bg-white/90">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌧️</span>
                <h3 className="font-serif font-bold text-sm text-[#17151C]">Library Rain Ambient</h3>
              </div>
              <p className="text-xs text-[#5F5965] leading-relaxed">
                Soft gentle rainfall, fireplace sounds, and cozy campus library room acoustics.
              </p>
            </Card>

            <Card variant="glass" hoverEffect className="p-5 border-[#E8E3F0] bg-white/90">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚡</span>
                <h3 className="font-serif font-bold text-sm text-[#17151C]">Deep Flow Synth</h3>
              </div>
              <p className="text-xs text-[#5F5965] leading-relaxed">
                Binaural waves and rhythmic electronic soundscapes designed for fast coding sprints.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
