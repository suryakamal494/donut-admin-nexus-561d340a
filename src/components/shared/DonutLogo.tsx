import { cn } from "@/lib/utils";

interface DonutLogoProps {
  size?: number;
  className?: string;
  variant?: "gradient" | "white";
}

const DonutLogo = ({ size = 40, className, variant = "gradient" }: DonutLogoProps) => {
  const gradientId = `donut-grad-${variant}`;
  
  const strokeColor = variant === "white" ? "white" : `url(#${gradientId})`;
  const fillColor = variant === "white" ? "white" : `url(#${gradientId})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      {variant === "gradient" && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(12, 85%, 65%)" />
            <stop offset="100%" stopColor="hsl(350, 70%, 60%)" />
          </linearGradient>
        </defs>
      )}
      {/* Outer ring — the donut body */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke={strokeColor}
        strokeWidth="10"
        fill="none"
      />
      {/* Left eye */}
      <circle cx="38" cy="42" r="4" fill={fillColor} />
      {/* Right eye */}
      <circle cx="62" cy="42" r="4" fill={fillColor} />
      {/* Inner smile arc */}
      <path
        d="M 36 58 Q 50 68 64 58"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
};

export default DonutLogo;
