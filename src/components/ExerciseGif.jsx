import { useState, useEffect, useRef } from "react";

function hexToHue(hex) {
  if (!hex || hex.length < 7) return 0;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return h;
}

export function ExerciseGif({ gifUrl, exerciseName, colors, size = 200 }) {
  const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "error"
  const imgRef = useRef(null);

  // Load and decode image before revealing — prevents white flash
  useEffect(() => {
    if (!gifUrl) return;
    setStatus("loading");

    const img = imgRef.current;
    if (!img) return;

    // If already cached and decoded, show immediately
    if (img.complete && img.naturalWidth > 0) {
      setStatus("loaded");
      return;
    }

    // Wait for load, then decode before revealing
    const handleLoad = () => {
      if (img.decode) {
        img.decode().then(() => setStatus("loaded")).catch(() => setStatus("loaded"));
      } else {
        setStatus("loaded");
      }
    };
    const handleError = () => setStatus("error");

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);
    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [gifUrl]);

  if (!gifUrl) return null;
  if (status === "error") return null;

  const isDark = colors?.appBg?.startsWith("#0") || colors?.appBg?.startsWith("#1");

  // Hue-rotate GIF muscle highlights (red) to match theme accent color
  const accentHue = hexToHue(colors?.accent);
  const imgFilter = isDark
    ? `invert(1) hue-rotate(${accentHue - 180}deg)`
    : `hue-rotate(${accentHue}deg)`;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
          // Match modal card bg so blend mode has the right backdrop
          background: colors?.cardBg || (isDark ? "#161b22" : "#ffffff"),
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
            filter: imgFilter,
            mixBlendMode: isDark ? "screen" : "multiply",
            // No transition — show instantly once decoded to prevent flash
            opacity: status === "loaded" ? 1 : 0,
            position: status === "loaded" ? "static" : "absolute",
          }}
          // onLoad/onError handled by useEffect event listeners
        />
      </div>
    </div>
  );
}
