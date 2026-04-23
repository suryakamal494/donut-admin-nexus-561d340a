import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, VideoQuestionData } from "../constants";
import { AnimatedText } from "../components/AnimatedText";
import { ProgressBar } from "../components/ProgressBar";

interface Props {
  data: VideoQuestionData;
}

export const ExplanationSteps: React.FC<Props> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepDelay = 30; // frames between each step

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, ${COLORS.warmBg} 0%, ${COLORS.warmBgDark} 50%, #FEF3E2 100%)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          fontSize: 16,
          fontWeight: 700,
          color: COLORS.coral,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          letterSpacing: 1,
        }}
      >
        STEP-BY-STEP SOLUTION
      </div>

      {/* Chapter badge */}
      <div
        style={{
          position: "absolute",
          top: 38,
          right: 60,
          padding: "5px 14px",
          borderRadius: 16,
          backgroundColor: COLORS.warmBgDark,
          fontSize: 13,
          fontWeight: 600,
          color: COLORS.mutedText,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {data.chapter}
      </div>

      {/* Steps */}
      <div style={{ position: "absolute", top: 100, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 28 }}>
        {data.explanation.map((step, i) => {
          const sDelay = 10 + i * stepDelay;
          const f = frame - sDelay;
          const entry = spring({ frame: f, fps, config: { damping: 20, stiffness: 180 } });
          const opacity = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 18,
                opacity,
                transform: `translateX(${interpolate(entry, [0, 1], [30, 0])}px)`,
              }}
            >
              {/* Step number circle */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${COLORS.coral}, ${COLORS.orange})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.white,
                  fontWeight: 700,
                  fontSize: 18,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              {/* Step text */}
              <div
                style={{
                  backgroundColor: COLORS.white,
                  padding: "16px 22px",
                  borderRadius: 14,
                  boxShadow: `0 2px 12px ${COLORS.shadow}`,
                  flex: 1,
                  fontSize: 19,
                  fontWeight: 500,
                  color: COLORS.darkText,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1.5,
                }}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>

      <ProgressBar currentScene={2} totalScenes={4} />
    </AbsoluteFill>
  );
};