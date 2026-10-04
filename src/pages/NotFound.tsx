import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full lumi-page-atmosphere flex items-center justify-center p-6 text-[#17151C] text-center">
      <div className="max-w-md rounded-3xl bg-white/80 p-8 sm:p-10 backdrop-blur-xl border border-[#E8E3F0] shadow-lg animate-lumi-fade-up">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEAFE] border border-[#DDD8F2] text-[#9E96D8]">
          <Sparkles size={24} />
        </div>
        <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#17151C]">
          404
        </h1>
        <p className="mt-2 font-serif text-xl font-medium text-[#17151C]">
          This page doesn't exist.
        </p>
        <p className="mt-1 text-xs text-[#5F5965]">
          The sanctuary or path you are looking for could not be found.
        </p>

        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#17151C] px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2D263B] hover:-translate-y-0.5 active:scale-98"
          >
            <ArrowLeft size={14} />
            <span>Back to LUMI</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
