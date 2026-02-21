import { cn } from "@/lib/utils";

interface DonutLogoProps {
  size?: number;
  className?: string;
  variant?: "gradient" | "white";
}

const DonutLogo = ({ size = 40, className, variant = "gradient" }: DonutLogoProps) => {
  const uid = Math.random().toString(36).slice(2, 8);
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
          {/* Main ring gradient — lighter coral top-left to deeper coral-red bottom-right */}
          <linearGradient id={`ring-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(15, 90%, 72%)" />
            <stop offset="100%" stopColor="hsl(348, 72%, 55%)" />
          </linearGradient>

          {/* Frosting highlight — semi-transparent arc on upper ring */}
          <linearGradient id={`frost-${uid}`} x1="30%" y1="0%" x2="70%" y2="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Inner hole — warm cream center with darker edge */}
          <radialGradient id={`hole-${uid}`} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="hsl(30, 35%, 93%)" stopOpacity="0.6" />
            <stop offset="70%" stopColor="hsl(20, 30%, 85%)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="hsl(12, 35%, 72%)" stopOpacity="0.35" />
          </radialGradient>

          {/* Drop shadow — warm coral instead of pure black */}
          <radialGradient id={`sh-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(12, 30%, 40%)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(12, 30%, 40%)" stopOpacity="0" />
          </radialGradient>

          {/* Pupil glow — subtle warm radial */}
          <radialGradient id={`pglow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(12, 60%, 55%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(12, 60%, 55%)" stopOpacity="0" />
          </radialGradient>

          {/* Thinking spark — white center fading out */}
          <radialGradient id={`spark-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="60%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      )}

      {/* Drop shadow — warmer, tighter */}
      {!isWhite && (
        <ellipse cx="50" cy="94" rx="22" ry="4" fill={`url(#sh-${uid})`} />
      )}

      {/* Antenna nub */}
      <rect
        x="46" y="5" width="8" height="9" rx="3.5"
        fill={isWhite ? "white" : `url(#ring-${uid})`}
      />
      <circle cx="50" cy="4" r="3" fill={isWhite ? "white" : `url(#ring-${uid})`} />

      {/* Thinking spark — soft glow above antenna */}
      {!isWhite && (
        <circle cx="50" cy="0" r="4" fill={`url(#spark-${uid})`} />
      )}

      {/* Main donut ring */}
      <circle
        cx="50" cy="50" r="30" strokeWidth="24"
        stroke={isWhite ? "white" : `url(#ring-${uid})`}
        fill="none"
      />

      {/* Inner hole — warm cream with concentric shadow edge */}
      {!isWhite && (
        <circle cx="50" cy="50" r="17" fill={`url(#hole-${uid})`} />
      )}

      {/* Frosting highlight on upper-left ring */}
      {!isWhite && (
        <ellipse cx="36" cy="32" rx="16" ry="10" fill={`url(#frost-${uid})`} />
      )}

      {/* === LEFT EYE === */}
      {/* Pupil glow aura */}
      {!isWhite && <circle cx="37" cy="40" r="9" fill={`url(#pglow-${uid})`} />}
      {/* White base */}
      <circle cx="36" cy="41" r="6.5" fill="white" opacity={isWhite ? 1 : 0.97} />
      {/* Pupil */}
      <circle cx="37.5" cy="39.5" r="3.5" fill={isWhite ? "rgba(0,0,0,0.35)" : "hsl(12, 50%, 28%)"} />
      {/* Inner pupil core */}
      {!isWhite && <circle cx="38" cy="39" r="2" fill="hsl(12, 40%, 18%)" />}
      {/* Single crisp sparkle */}
      <circle cx="34" cy="38" r="1.8" fill="white" />

      {/* === RIGHT EYE === */}
      {/* Pupil glow aura */}
      {!isWhite && <circle cx="65" cy="39" r="9" fill={`url(#pglow-${uid})`} />}
      {/* White base */}
      <circle cx="64" cy="40" r="6.5" fill="white" opacity={isWhite ? 1 : 0.97} />
      {/* Pupil */}
      <circle cx="65.5" cy="38.5" r="3.5" fill={isWhite ? "rgba(0,0,0,0.35)" : "hsl(12, 50%, 28%)"} />
      {/* Inner pupil core */}
      {!isWhite && <circle cx="66" cy="38" r="2" fill="hsl(12, 40%, 18%)" />}
      {/* Single crisp sparkle */}
      <circle cx="62" cy="37" r="1.8" fill="white" />

      {/* === SMILE — confident, not grinning === */}
      <path
        d="M 39 61 Q 50 69 61 61"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity={isWhite ? 0.9 : 0.85}
      />

      {/* === BLUSH — warmer peach, subtler === */}
      {!isWhite && (
        <>
          <ellipse cx="24" cy="52" rx="4.5" ry="3" fill="hsl(15, 70%, 75%)" opacity="0.25" />
          <ellipse cx="76" cy="52" rx="4.5" ry="3" fill="hsl(15, 70%, 75%)" opacity="0.25" />
        </>
      )}
    </svg>
  );
};

export default DonutLogo;
