import { cn } from "@/lib/utils";

interface DonutLogoProps {
  size?: number;
  className?: string;
  variant?: "gradient" | "white";
}

const DonutLogo = ({ size = 40, className, variant = "gradient" }: DonutLogoProps) => {
  const gradientId = `donut-grad-${Math.random().toString(36).slice(2, 8)}`;
  const highlightId = `donut-hl-${gradientId}`;
  const shadowId = `donut-sh-${gradientId}`;
  const holeGradId = `donut-hole-${gradientId}`;

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
          <linearGradient id={highlightId} x1="25%" y1="0%" x2="75%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={holeGradId} cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="hsl(12, 25%, 88%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(12, 35%, 78%)" stopOpacity="0.35" />
          </radialGradient>
        </defs>
      )}

      {/* Drop shadow */}
      {!isWhite && (
        <ellipse cx="50" cy="94" rx="26" ry="4.5" fill={`url(#${shadowId})`} />
      )}

      {/* Antenna nub */}
      <rect
        x="46"
        y="5"
        width="8"
        height="9"
        rx="3.5"
        fill={isWhite ? "white" : `url(#${gradientId})`}
      />
      <circle
        cx="50"
        cy="4"
        r="3"
        fill={isWhite ? "white" : `url(#${gradientId})`}
      />

      {/* Main donut ring */}
      <circle
        cx="50"
        cy="50"
        r="30"
        strokeWidth="24"
        stroke={isWhite ? "white" : `url(#${gradientId})`}
        fill="none"
      />

      {/* Inner hole depth shading */}
      {!isWhite && (
        <circle cx="50" cy="50" r="17" fill={`url(#${holeGradId})`} />
      )}

      {/* 3D gloss highlight on upper-left ring */}
      {!isWhite && (
        <ellipse
          cx="35"
          cy="30"
          rx="18"
          ry="11"
          fill={`url(#${highlightId})`}
        />
      )}

      {/* === EYES — bigger, rounder, looking slightly up-right === */}

      {/* Left eye — white base */}
      <circle cx="35" cy="40" r="8" fill="white" opacity={isWhite ? 1 : 0.97} />
      {/* Left pupil — large, looking up-right for curiosity */}
      <circle cx="37" cy="38" r="4.5" fill={isWhite ? "rgba(0,0,0,0.35)" : "hsl(12, 55%, 30%)"} />
      {/* Left inner pupil — darker core */}
      {!isWhite && <circle cx="37.5" cy="37.5" r="2.5" fill="hsl(12, 40%, 20%)" />}
      {/* Left eye sparkle — primary */}
      <circle cx="34" cy="36" r="2.2" fill="white" opacity="1" />
      {/* Left eye sparkle — secondary smaller */}
      <circle cx="39" cy="40" r="1" fill="white" opacity="0.7" />

      {/* Right eye — white base */}
      <circle cx="65" cy="40" r="8" fill="white" opacity={isWhite ? 1 : 0.97} />
      {/* Right pupil — large, looking up-right */}
      <circle cx="67" cy="38" r="4.5" fill={isWhite ? "rgba(0,0,0,0.35)" : "hsl(12, 55%, 30%)"} />
      {/* Right inner pupil — darker core */}
      {!isWhite && <circle cx="67.5" cy="37.5" r="2.5" fill="hsl(12, 40%, 20%)" />}
      {/* Right eye sparkle — primary */}
      <circle cx="64" cy="36" r="2.2" fill="white" opacity="1" />
      {/* Right eye sparkle — secondary smaller */}
      <circle cx="69" cy="40" r="1" fill="white" opacity="0.7" />

      {/* === SMILE — wider, warmer curve === */}
      <path
        d="M 34 63 Q 50 76 66 63"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
        opacity={isWhite ? 0.9 : 0.75}
      />

      {/* === BLUSH — warmer, slightly larger === */}
      {!isWhite && (
        <>
          <ellipse cx="23" cy="55" rx="5" ry="3.5" fill="hsl(350, 80%, 72%)" opacity="0.35" />
          <ellipse cx="77" cy="55" rx="5" ry="3.5" fill="hsl(350, 80%, 72%)" opacity="0.35" />
        </>
      )}
    </svg>
  );
};

export default DonutLogo;
