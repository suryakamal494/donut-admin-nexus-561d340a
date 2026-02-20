import { cn } from "@/lib/utils";

interface DonutLogoProps {
  size?: number;
  className?: string;
  variant?: "gradient" | "white";
}

const DonutLogo = ({ size = 40, className, variant = "gradient" }: DonutLogoProps) => {
  const gradientId = `donut-grad-${variant}`;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      <defs>
        {variant === "gradient" ? (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(12, 85%, 65%)" />
            <stop offset="100%" stopColor="hsl(25, 90%, 58%)" />
          </linearGradient>
        ) : (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
        )}
      </defs>
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke={`url(#${gradientId})`}
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="188 32"
        transform="rotate(-60 50 50)"
      />
    </svg>
  );
};

export default DonutLogo;
