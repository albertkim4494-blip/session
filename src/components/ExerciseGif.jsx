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

  const isDark = colors?.appBg?.startsWith("#0") || colors?.appBg?.startsWith("#1");

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
              background: isDark
                ? "linear-gradient(110deg, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 70%)"
                : "linear-gradient(110deg, #f0f0f0 30%, #e0e0e0 50%, #f0f0f0 70%)",
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
            // Dark theme: invert the GIF (white bg→black, dark figure→light) then screen (black→transparent)
            // Light theme: multiply (white→transparent, dark figure stays)
            filter: isDark ? "invert(1)" : "none",
            mixBlendMode: isDark ? "screen" : "multiply",
            // Use opacity instead of display:none — display:none prevents onLoad from firing in some browsers
            opacity: status === "loaded" ? 1 : 0,
            transition: "opacity 0.25s ease-out",
            position: status === "loaded" ? "static" : "absolute",
          }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      </div>
    </div>
  );
}
