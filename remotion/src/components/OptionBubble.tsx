import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "../constants";

interface Props {
  label: string;
  text: string;
  isCorrect: boolean;
  isWrong: boolean;
  showResult: boolean;
  delay?: number;
}

export const OptionBubble: React.FC<Props> = ({
  label,
  text,
  isCorrect,
  isWrong,
  showResult,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  const entry = spring({ frame: f, fps, config: { damping: 20, stiffness: 200 } });
  const opacity = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scale = interpolate(entry, [0, 1], [0.9, 1]);

  let bgColor = COLORS.white;
  let borderColor = "#E5E0DC";
  let textColor = COLORS.darkText;
  let labelBg = COLORS.warmBgDark;

  if (showResult && isCorrect) {
    bgColor = COLORS.correctBg;
    borderColor = COLORS.correct;
    labelBg = COLORS.correct;
    textColor = "#065F46";
  } else if (showResult && isWrong) {
    bgColor = COLORS.incorrectBg;
    borderColor = COLORS.incorrect;
    labelBg = COLORS.incorrect;
    textColor = "#991B1B";
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 20px",
        borderRadius: 14,
        border: `2px solid ${borderColor}`,
        backgroundColor: bgColor,
        opacity,
        transform: `scale(${scale}) translateX(${interpolate(entry, [0, 1], [20, 0])}px)`,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: labelBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 16,
          color: showResult && (isCorrect || isWrong) ? COLORS.white : COLORS.darkText,
          flexShrink: 0,
        }}
      >
        {showResult && isCorrect ? "✓" : showResult && isWrong ? "✗" : label.toUpperCase()}
      </div>
      <span style={{ fontSize: 18, fontWeight: 500, color: textColor }}>{text}</span>
    </div>
  );
};