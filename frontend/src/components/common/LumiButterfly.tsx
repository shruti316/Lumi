
interface LumiButterflyProps {
  className?: string;
  size?: number;
}

export function LumiButterfly({ className = "", size = 22 }: LumiButterflyProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`lumi-butterfly-mark transition-colors duration-200 ${className}`}
      aria-hidden="true"
    >
      {/* Central slender butterfly body & head */}
      <path
        d="M16 10V23"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="9" r="1.1" fill="currentColor" />

      {/* Graceful delicate antennae */}
      <path
        d="M15.5 8.2C14.2 6.2 12.3 5.4 10.8 6"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="10.5" cy="6.2" r="0.65" fill="currentColor" />
      <path
        d="M16.5 8.2C17.8 6.2 19.7 5.4 21.2 6"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="21.5" cy="6.2" r="0.65" fill="currentColor" />

      {/* Upper Wings with fine editorial curves */}
      <path
        d="M16 12C13.5 8.2 6.8 8.5 5.5 13.8C4.3 18.2 10.2 20.2 15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.22"
      />
      <path
        d="M16 12C18.5 8.2 25.2 8.5 26.5 13.8C27.7 18.2 21.8 20.2 16.5 16.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.22"
      />

      {/* Lower Wings */}
      <path
        d="M15.5 16.8C11.5 18 7.5 21 9.5 25C11.3 28.5 15.2 22.8 16 19.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M16.5 16.8C20.5 18 24.5 21 22.5 25C20.7 28.5 16.8 22.8 16 19.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Delicate inner wing vein details */}
      <path
        d="M14.5 14C11.2 13 8.2 14 7.2 15.5"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M17.5 14C20.8 13 23.8 14 24.8 15.5"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}
