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
          <linearGradient id={highlightId} x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.30" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={holeGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(12, 30%, 85%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(12, 40%, 80%)" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      )}

      {/* Drop shadow */}
      {!isWhite && (
        <ellipse cx="50" cy="93" rx="28" ry="5" fill={`url(#${shadowId})`} />
      )}

      {/* Antenna nub */}
      <rect
        x="46"
        y="6"
        width="8"
        height="8"
        rx="3"
        fill={isWhite ? "white" : `url(#${gradientId})`}
      />
      <circle
        cx="50"
        cy="5"
        r="2.5"
        fill={isWhite ? "white" : `url(#${gradientId})`}
      />

      {/* Main donut ring — thick stroked circle */}
      <circle
        cx="50"
        cy="50"
        r="32"
        strokeWidth="22"
        stroke={isWhite ? "white" : `url(#${gradientId})`}
        fill="none"
      />

      {/* Inner hole depth shading */}
      {!isWhite && (
        <circle cx="50" cy="50" r="20" fill={`url(#${holeGradId})`} />
      )}

      {/* 3D gloss highlight on upper-left ring */}
      {!isWhite && (
        <ellipse
          cx="36"
          cy="32"
          rx="16"
          ry="10"
          fill={`url(#${highlightId})`}
        />
      )}

      {/* Left eye — white base */}
      <circle cx="34" cy="38" r="7" fill="white" opacity={isWhite ? 1 : 0.95} />
      {/* Left pupil — looking slightly up-right */}
      <circle cx="35.5" cy="37" r="3.5" fill={isWhite ? "rgba(0,0,0,0.3)" : "hsl(12, 60%, 35%)"} />
      {/* Left eye sparkle */}
      <circle cx="33" cy="35" r="1.8" fill="white" opacity="0.95" />

      {/* Right eye — white base */}
      <circle cx="66" cy="38" r="7" fill="white" opacity={isWhite ? 1 : 0.95} />
      {/* Right pupil — looking slightly up-right */}
      <circle cx="67.5" cy="37" r="3.5" fill={isWhite ? "rgba(0,0,0,0.3)" : "hsl(12, 60%, 35%)"} />
      {/* Right eye sparkle */}
      <circle cx="65" cy="35" r="1.8" fill="white" opacity="0.95" />

      {/* Smile — wider, gentler on lower ring */}
      <path
        d="M 36 62 Q 50 73 64 62"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity={isWhite ? 0.85 : 0.7}
      />

      {/* Blush marks */}
      {!isWhite && (
        <>
          <circle cx="24" cy="54" r="4" fill="hsl(350, 80%, 70%)" opacity="0.3" />
          <circle cx="76" cy="54" r="4" fill="hsl(350, 80%, 70%)" opacity="0.3" />
        </>
      )}
    </svg>
  );
};

export default DonutLogo;
