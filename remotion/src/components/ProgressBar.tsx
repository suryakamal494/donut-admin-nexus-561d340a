import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../constants";

interface Props {
  currentScene: number;
  totalScenes: number;
}

export const ProgressBar: React.FC<Props> = ({ currentScene, totalScenes }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: "0 60px",
        position: "absolute",
        bottom: 24,
        left: 0,
        right: 0,
        opacity: interpolate(frame, [0, 10], [0, 0.7], { extrapolateRight: "clamp" }),
      }}
    >
      {Array.from({ length: totalScenes }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: i < currentScene ? COLORS.coral : i === currentScene
              ? COLORS.coralLight
              : "rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          {i === currentScene && (
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                backgroundColor: COLORS.coral,
                borderRadius: 2,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};