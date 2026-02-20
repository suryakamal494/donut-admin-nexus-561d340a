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
      {/* Outer ring — diagnostic layer */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke={strokeColor}
        strokeWidth="8"
        fill="none"
      />
      {/* Inner ring — assessment layer */}
      <circle
        cx="50"
        cy="50"
        r="24"
        stroke={strokeColor}
        strokeWidth="6"
        fill="none"
      />
      {/* Center dot — the student */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill={fillColor}
      />
    </svg>
  );
};

export default DonutLogo;
