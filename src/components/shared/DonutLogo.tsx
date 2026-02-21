import { cn } from "@/lib/utils";

interface DonutLogoProps {
  size?: number;
  className?: string;
  variant?: "gradient" | "white";
}

const DonutLogo = ({ size = 40, className, variant = "gradient" }: DonutLogoProps) => {
  const gradientId = `donut-bot-grad-${Math.random().toString(36).slice(2, 8)}`;
  const highlightId = `donut-bot-highlight-${gradientId}`;
  const shadowId = `donut-bot-shadow-${gradientId}`;

  const isWhite = variant === "white";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      {!isWhite && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(12, 85%, 65%)" />
            <stop offset="100%" stopColor="hsl(350, 70%, 60%)" />
          </linearGradient>
          <linearGradient id={highlightId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
      )}

      {/* Drop shadow — floating 3D effect */}
      {!isWhite && (
        <ellipse cx="50" cy="93" rx="26" ry="5" fill={`url(#${shadowId})`} />
      )}

      {/* Antenna nub */}
      <rect
        x="45"
        y="8"
        width="10"
        height="10"
        rx="4"
        fill={isWhite ? "white" : `url(#${gradientId})`}
      />
      {/* Antenna connector dot */}
      <circle
        cx="50"
        cy="7"
        r="3"
        fill={isWhite ? "white" : `url(#${gradientId})`}
      />

      {/* Main body — rounded square */}
      <rect
        x="12"
        y="18"
        width="76"
        height="66"
        rx="20"
        ry="20"
        fill={isWhite ? "none" : `url(#${gradientId})`}
        stroke={isWhite ? "white" : "none"}
        strokeWidth={isWhite ? 3 : 0}
      />

      {/* 3D highlight/gloss overlay */}
      {!isWhite && (
        <ellipse
          cx="38"
          cy="32"
          rx="22"
          ry="14"
          fill={`url(#${highlightId})`}
        />
      )}

      {/* Left eye — white base */}
      <circle cx="36" cy="46" r="8" fill={isWhite ? "white" : "white"} opacity={isWhite ? 1 : 0.95} />
      {/* Left pupil */}
      <circle cx="37" cy="47" r="4" fill={isWhite ? "rgba(0,0,0,0.3)" : "hsl(12, 60%, 35%)"} />
      {/* Left eye sparkle */}
      <circle cx="34" cy="44" r="2" fill="white" opacity="0.9" />

      {/* Right eye — white base */}
      <circle cx="64" cy="46" r="8" fill={isWhite ? "white" : "white"} opacity={isWhite ? 1 : 0.95} />
      {/* Right pupil */}
      <circle cx="65" cy="47" r="4" fill={isWhite ? "rgba(0,0,0,0.3)" : "hsl(12, 60%, 35%)"} />
      {/* Right eye sparkle */}
      <circle cx="62" cy="44" r="2" fill="white" opacity="0.9" />

      {/* Smile */}
      <path
        d="M 38 62 Q 50 72 62 62"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity={isWhite ? 0.9 : 0.8}
      />

      {/* Blush marks */}
      {!isWhite && (
        <>
          <circle cx="26" cy="58" r="4" fill="hsl(350, 80%, 70%)" opacity="0.35" />
          <circle cx="74" cy="58" r="4" fill="hsl(350, 80%, 70%)" opacity="0.35" />
        </>
      )}
    </svg>
  );
};

export default DonutLogo;
