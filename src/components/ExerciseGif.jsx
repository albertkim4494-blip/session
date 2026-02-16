import { useState, useEffect } from "react";

export function ExerciseGif({ gifUrl, exerciseName, colors, size = 200 }) {
  const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "error"

  // Reset status whenever gifUrl changes
  useEffect(() => {
    if (gifUrl) {
      setStatus("loading");
    }
  }, [gifUrl]);

  if (!gifUrl) return null;

  // On error, just hide — no fallback UI
  if (status === "error") return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          background: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Loading skeleton */}
        {status === "loading" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(110deg, #f0f0f0 30%, #e0e0e0 50%, #f0f0f0 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              borderRadius: 12,
            }}
          />
        )}

        <img
          src={gifUrl}
          alt={`${exerciseName} demonstration`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            mixBlendMode: "multiply",
            // Use opacity instead of display:none — display:none prevents onLoad from firing in some browsers
            opacity: status === "loaded" ? 1 : 0,
            position: status === "loaded" ? "static" : "absolute",
          }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      </div>
    </div>
  );
}
