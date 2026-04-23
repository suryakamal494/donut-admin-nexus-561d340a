import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "../constants";

interface Props {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  delay?: number;
  direction?: "up" | "left" | "right";
  maxWidth?: number;
}

export const AnimatedText: React.FC<Props> = ({
  text,
  fontSize = 24,
  color = COLORS.darkText,
  fontWeight = 600,
  delay = 0,
  direction = "up",
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  const progress = spring({ frame: f, fps, config: { damping: 20, stiffness: 180 } });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const translateMap = {
    up: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
    left: `translateX(${interpolate(progress, [0, 1], [-40, 0])}px)`,
    right: `translateX(${interpolate(progress, [0, 1], [40, 0])}px)`,
  };

  return (
    <div
      style={{
        fontSize,
        color,
        fontWeight,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transform: translateMap[direction],
        opacity,
        maxWidth: maxWidth || "100%",
        lineHeight: 1.4,
      }}
    >
      {text}
    </div>
  );
};