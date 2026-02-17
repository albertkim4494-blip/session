import { useState, useEffect, useRef } from "react";

export function ExerciseGif({ gifUrl, exerciseName, colors, size = 200 }) {
  const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "error"
  const imgRef = useRef(null);

  // Reset status whenever gifUrl changes and check if already cached
  useEffect(() => {
    if (!gifUrl) return;
    setStatus("loading");
    // If the image is already cached, onLoad may not fire — check complete
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setStatus("loaded");
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
          background: "transparent",
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
                : "linear-gradient(110deg, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              borderRadius: 12,
            }}
          />
        )}

        <img
          ref={imgRef}
          key={gifUrl}
          src={gifUrl}
          alt={`${exerciseName} demonstration`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: isDark ? "invert(1)" : "none",
            mixBlendMode: isDark ? "screen" : "multiply",
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
