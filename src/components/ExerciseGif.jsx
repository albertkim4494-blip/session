import { useState, useEffect } from "react";
import { getExerciseGif } from "../lib/exerciseGifApi";

export function ExerciseGif({ exerciseName, colors }) {
  const [gifUrl, setGifUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setGifUrl(null);

    getExerciseGif(exerciseName).then((result) => {
      if (cancelled) return;
      setGifUrl(result?.gifUrl || null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [exerciseName]);

  // Loading skeleton
  if (loading) {
    return (
      <div
        style={{
          height: 220,
          borderRadius: 12,
          background: colors.subtleBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 28,
              height: 28,
              border: `2.5px solid ${colors.border}`,
              borderTopColor: colors.accent,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 8px",
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.4 }}>
            Loading demo...
          </span>
        </div>
      </div>
    );
  }

  // No GIF available — collapse gracefully
  if (!gifUrl) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src={gifUrl}
        alt={`${exerciseName} demonstration`}
        style={{
          maxWidth: 200,
          maxHeight: 200,
          display: "block",
          mixBlendMode: "multiply",
        }}
        loading="lazy"
      />
    </div>
  );
}
