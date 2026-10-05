import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Clock, BookOpen, CheckCircle2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "login" | "signup";
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // Very subtle dampening: mouse position offset mapped to -6px .. +6px
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      setMousePos({ x, y });
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      data-auth-mode={mode}
      className="relative min-h-screen w-full overflow-hidden bg-[#F7F5F8] text-[#17151C] flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans selection:bg-[#DDD8F2] selection:text-[#17151C]"
    >
      {/* ─────────────────────────────────────────────────────────────
          ORGANIC SLOW FLOATING PASTEL ORBS (8-17s cycles)
      ───────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Lavender Orb */}
        <div
          className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] sm:h-[650px] sm:w-[650px] rounded-full bg-gradient-to-br from-[#B8B3E8]/45 via-[#DCD8F2]/35 to-transparent blur-[100px] animate-lumi-orb-1"
          style={{
            transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)`,
            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Blush Pink Orb */}
        <div
          className="absolute top-[5%] -right-[12%] h-[450px] w-[450px] sm:h-[600px] sm:w-[600px] rounded-full bg-gradient-to-bl from-[#E8B9CD]/40 via-[#F2D8E4]/30 to-transparent blur-[110px] animate-lumi-orb-2"
          style={{
            transform: `translate(${-mousePos.x * 1.1}px, ${mousePos.y * 1.1}px)`,
            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Powder Blue Orb */}
        <div
          className="absolute -bottom-[12%] left-[15%] h-[480px] w-[480px] sm:h-[620px] sm:w-[620px] rounded-full bg-gradient-to-tr from-[#B8D4E8]/40 via-[#D9E7F2]/30 to-transparent blur-[105px] animate-lumi-orb-3"
          style={{
            transform: `translate(${mousePos.x * 0.9}px, ${-mousePos.y * 0.9}px)`,
            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Soft Peach / Cream Glow */}
        <div
          className="absolute -bottom-[8%] -right-[8%] h-[400px] w-[400px] sm:h-[550px] sm:w-[550px] rounded-full bg-gradient-to-tl from-[#F1D2C9]/35 via-[#FDF3EC]/25 to-transparent blur-[95px] animate-lumi-orb-4"
          style={{
            transform: `translate(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px)`,
            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Center Luminous Atmosphere Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[750px] w-[750px] rounded-full bg-white/40 blur-[120px]" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DECORATIVE FLOATING PARTICLES & EDITORIAL GEOMETRY
      ───────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-[18%] left-[8%] h-24 w-24 rounded-full border border-[#9E96D8]/20 animate-lumi-float" />
        <div className="absolute top-[72%] left-[45%] h-36 w-36 rounded-full border border-[#E8B9CD]/25 animate-lumi-float [animation-delay:2.5s]" />
        <div className="absolute top-[28%] right-[6%] h-20 w-20 rounded-full border border-[#B8D4E8]/30 animate-lumi-float [animation-delay:4s]" />

        {/* Floating sparkles */}
        <div className="absolute top-[15%] left-[22%] text-[#9E96D8]/50 animate-lumi-twinkle text-lg">
          ✦
        </div>
        <div className="absolute top-[82%] left-[12%] text-[#D99BB8]/60 animate-lumi-twinkle [animation-delay:1.5s] text-base">
          ✦
        </div>
        <div className="absolute top-[22%] right-[18%] text-[#B8D4E8]/60 animate-lumi-twinkle [animation-delay:3s] text-xl">
          ✦
        </div>
        <div className="absolute top-[68%] right-[10%] text-[#9E96D8]/45 animate-lumi-twinkle [animation-delay:2s] text-sm">
          ✦
        </div>

        {/* Soft editorial line accents */}
        <div className="hidden lg:block absolute top-[40%] left-[4%] h-[1px] w-20 bg-gradient-to-r from-transparent via-[#9E96D8]/30 to-transparent" />
        <div className="hidden lg:block absolute bottom-[25%] right-[4%] h-[1px] w-24 bg-gradient-to-r from-transparent via-[#D99BB8]/30 to-transparent" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN AUTHENTICATION CONTAINER (Two-column desktop / Stacked mobile)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: EDITORIAL BRANDING & ARTISTIC COMPOSITION */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left py-2 lg:py-6">
            
            {/* Top Logo with gentle reveal animation */}
            <div className="animate-lumi-logo flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-white/70 px-4 py-1.5 backdrop-blur-md border border-[#E8E3F0] shadow-2xs mb-5">
                <span className="h-2 w-2 rounded-full bg-[#9E96D8] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5F5965]">
                  Personal Life Sanctuary
                </span>
                <Sparkles size={12} className="text-[#9E96D8]" />
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#17151C] leading-[1.08]">
                LUMI
              </h1>

              <div className="mt-4 space-y-1 font-serif text-2xl sm:text-3xl lg:text-4xl text-[#17151C] leading-snug">
                <p>Your space.</p>
                <p className="font-editorial-italic font-normal text-[#9E96D8]">
                  Your rhythm.
                </p>
                <p>Your little world.</p>
              </div>

              <p className="mt-4 max-w-md text-sm sm:text-base font-normal text-[#5F5965] leading-relaxed mx-auto lg:mx-0">
                A calm, editorial sanctuary designed for your thoughts, daily intentions, deep focus, and quiet progress.
              </p>
            </div>

            {/* ARTISTIC LAYERED PASTEL CARDS (Desktop Preview Composition) */}
            <div className="mt-8 hidden lg:block relative pt-2">
              <div className="relative w-full max-w-md h-56">
                
                {/* Back Card (Peach / Pink) */}
                <div className="absolute top-0 right-4 w-72 rounded-2xl bg-gradient-to-br from-[#F7E4DC]/90 to-[#FDF3EC]/95 p-4 border border-[#F1D2C9]/60 shadow-md backdrop-blur-md transform rotate-3 transition-transform duration-500 hover:rotate-1 animate-lumi-float [animation-delay:1s]">
                  <div className="flex items-center justify-between text-xs text-[#5F5965] mb-2">
                    <span className="font-serif font-bold text-[#17151C]">Weekly Sanctuary</span>
                    <Heart size={13} className="text-[#D99BB8]" />
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden">
                    <div className="h-full w-4/5 rounded-full bg-[#D99BB8]" />
                  </div>
                  <p className="mt-2 text-[11px] text-[#8D8792]">80% of weekly intentions aligned</p>
                </div>

                {/* Middle Card (Powder Blue) */}
                <div className="absolute top-10 left-2 w-76 rounded-2xl bg-gradient-to-br from-[#D9E7F2]/90 to-[#EEF4F8]/95 p-4 border border-[#B8D4E8]/60 shadow-md backdrop-blur-md transform -rotate-2 transition-transform duration-500 hover:-rotate-1 animate-lumi-float [animation-delay:3s]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen size={14} className="text-[#6B8EA8]" />
                    <span className="text-xs font-bold text-[#17151C]">Mindful Reading</span>
                  </div>
                  <p className="text-[11px] text-[#5F5965] italic">"Stillness is where clarity begins."</p>
                </div>

                {/* Front Floating Card (Lavender / Glass) */}
                <div className="absolute top-20 right-8 w-72 rounded-2xl bg-gradient-to-br from-[#DCD8F2]/95 to-[#F0EEF8]/95 p-4 border border-[#B8B3E8]/70 shadow-lg backdrop-blur-lg transform rotate-1 transition-transform duration-500 hover:scale-102 animate-lumi-float">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5BA5]">Daily Rhythm</span>
                    <span className="text-[10px] text-[#6B5BA5] flex items-center gap-1 font-semibold">
                      <Clock size={11} /> 09:00 AM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#9E96D8]" />
                    <span className="text-xs font-bold text-[#17151C]">Morning Deep Work Session</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: AUTHENTICATION CARD */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="animate-lumi-auth-card relative rounded-3xl bg-white/85 p-7 sm:p-10 backdrop-blur-xl border border-white/90 shadow-[0_16px_40px_rgba(80,70,120,0.08)] transition-all duration-300">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
