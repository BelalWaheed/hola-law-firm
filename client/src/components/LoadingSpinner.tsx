import React from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = true,
  text = "جاري التحميل...",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-bg-primary select-none ${
        fullScreen ? "min-h-screen w-full fixed inset-0 z-50" : "p-8 w-full"
      }`}
    >
      {/* Background patterns if fullscreen */}
      {fullScreen && (
        <>
          <div className="bg-pattern" />
          <div className="blob blob-1 opacity-50" />
          <div className="blob blob-2 opacity-50" />
        </>
      )}

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Animated Custom Gold Spinner */}
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-3 border-accent-gold/10 border-t-accent-gold animate-spin" />
          
          {/* Inner Glow Ring */}
          <div className="absolute inset-1.5 rounded-full border-3 border-accent-gold/5 border-b-accent-gold-light/40 animate-spin [animation-duration:1.5s]" />

          {/* Center Scale Icon */}
          <svg
            className="w-6 h-6 text-accent-gold animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Beam & Pillar */}
            <path d="M12 3v17" />
            <path d="M12 6h7M12 6H5" />
            {/* Left hanger */}
            <path d="M5 6l-2 6h4l-2-6z" />
            {/* Right hanger */}
            <path d="M19 6l-2 6h4l-2-6z" />
            {/* Base */}
            <path d="M9 20h6" />
          </svg>
        </div>

        {/* Pulsing Arabic text */}
        <p className="text-accent-gold-light text-lg font-bold font-amiri tracking-wide animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};
