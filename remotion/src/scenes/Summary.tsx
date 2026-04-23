import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, VideoQuestionData } from "../constants";
import { ProgressBar } from "../components/ProgressBar";

interface Props {
  data: VideoQuestionData;
}

export const Summary: React.FC<Props> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardEntry = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 120 } });
  const brandEntry = spring({ frame: frame - 60, fps, config: { damping: 20 } });

  // Subtle floating animation for bg decorations
  const float = Math.sin(frame / 20) * 4;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.warmBg} 0%, ${COLORS.warmBgDark} 40%, #FEE5D8 100%)`,
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -80 + float,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.coralLight}33, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100 - float,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.orange}22, transparent)`,
        }}
      />

      {/* Key Takeaway label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          fontSize: 14,
          fontWeight: 700,
          color: COLORS.coral,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: 2,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        💡 KEY TAKEAWAY
      </div>

      {/* Takeaway card */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 60,
          right: 60,
          backgroundColor: COLORS.white,
          borderRadius: 20,
          padding: "36px 40px",
          boxShadow: `0 8px 40px ${COLORS.shadow}`,
          transform: `scale(${interpolate(cardEntry, [0, 1], [0.92, 1])}) translateY(${interpolate(cardEntry, [0, 1], [20, 0])}px)`,
          opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          borderLeft: `4px solid ${COLORS.coral}`,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: COLORS.darkText,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.5,
          }}
        >
          {data.takeaway}
        </div>
      </div>

      {/* Answer summary */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 60,
          right: 60,
          display: "flex",
          gap: 24,
          opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "18px 24px",
            borderRadius: 14,
            backgroundColor: COLORS.incorrectBg,
            border: `1px solid ${COLORS.incorrect}33`,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.incorrect, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>
            Your Answer
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#991B1B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ({data.wrongAnswerId.toUpperCase()}) {data.options.find(o => o.id === data.wrongAnswerId)?.text}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "18px 24px",
            borderRadius: 14,
            backgroundColor: COLORS.correctBg,
            border: `1px solid ${COLORS.correct}33`,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.correct, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>
            Correct Answer
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#065F46", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ({data.correctAnswerId.toUpperCase()}) {data.options.find(o => o.id === data.correctAnswerId)?.text}
          </div>
        </div>
      </div>

      {/* Brand footer */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(frame, [55, 70], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(brandEntry, [0, 1], [10, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${COLORS.coral}, ${COLORS.orange})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.white,
            fontWeight: 800,
            fontSize: 16,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          D
        </div>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${COLORS.coral}, ${COLORS.orange})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          DonutAI
        </span>
      </div>

      <ProgressBar currentScene={3} totalScenes={4} />
    </AbsoluteFill>
  );
};