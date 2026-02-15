import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { ANIMATIONS } from "../lib/animationData";
import { fetchAnimation, preloadAnimation } from "../lib/exerciseAnimationApi";
import { radius } from "../styles/theme";

// Lazy-load Canvas — keeps entire Three.js tree out of main bundle
const Canvas = React.lazy(() =>
  import("@react-three/fiber").then((m) => ({ default: m.Canvas }))
);
// Lazy-load the inner scene (imports three, useFrame, OrbitControls)
const ExerciseScene3D = React.lazy(() => import("./ExerciseScene3D"));

// ── WebGL detection ────────────────────────────────────────────────────────
let _webglSupported = null;
function isWebGLSupported() {
  if (_webglSupported !== null) return _webglSupported;
  try {
    const c = document.createElement("canvas");
    _webglSupported = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    _webglSupported = false;
  }
  return _webglSupported;
}

// ── DPR detection — cap at 1 on low-end devices ───────────────────────────
function getMaxDpr() {
  try {
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4; // GB, only Chrome
    if (cores <= 2 || mem <= 2) return 1;
  } catch { /* ignore */ }
  return 2;
}

// ── Main component ─────────────────────────────────────────────────────────
export function ExerciseViewer3D({ exerciseId, exerciseName, exerciseMeta, colors, adjacentIds }) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [ready, setReady] = useState(false);
  const [animation, setAnimation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resetCamera, setResetCamera] = useState(0);
  const mountedRef = useRef(true);
  const maxDpr = useRef(getMaxDpr()).current;

  // Fetch animation when exerciseId changes
  useEffect(() => {
    mountedRef.current = true;
    setReady(false);
    setProgress(0);

    // Check hardcoded animations first (instant)
    const hardcoded = ANIMATIONS[exerciseId];
    if (hardcoded) {
      setAnimation(hardcoded);
      setLoading(false);
      setError(false);
      return;
    }

    // Async fetch from cache/storage/AI
    if (!exerciseId || !exerciseName) {
      setAnimation(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    fetchAnimation(exerciseId, exerciseName, exerciseMeta)
      .then((data) => {
        if (!mountedRef.current) return;
        if (data) {
          setAnimation(data);
          setError(false);
        } else {
          setAnimation(null);
          setError(true);
        }
      })
      .catch(() => {
        if (!mountedRef.current) return;
        setAnimation(null);
        setError(true);
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });

    return () => { mountedRef.current = false; };
  }, [exerciseId, exerciseName]);

  // Preload adjacent animations (prev/next for swipe navigation)
  useEffect(() => {
    if (!adjacentIds) return;
    for (const adj of adjacentIds) {
      if (adj?.id) preloadAnimation(adj.id, adj.name, adj.meta);
    }
  }, [adjacentIds]);

  // Progress callback (throttled to avoid excessive re-renders)
  const lastProgressUpdate = useRef(0);
  const onProgress = useCallback((normalizedTime) => {
    const now = performance.now();
    if (now - lastProgressUpdate.current > 100) { // Update at most 10x/sec
      lastProgressUpdate.current = now;
      setProgress(normalizedTime);
    }
  }, []);

  if (!isWebGLSupported()) return null;

  // No animation and not loading — don't render the container
  if (!animation && !loading) return null;

  const speeds = [0.5, 1, 2];

  return (
    <div style={{
      height: 220,
      borderRadius: radius.lg,
      background: colors.subtleBg,
      overflow: "hidden",
      position: "relative",
      touchAction: "none",
    }}>
      {/* Loading state: skeleton pulse */}
      {loading && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: colors.text,
          opacity: 0.4,
          fontSize: 12,
          gap: 8,
          zIndex: 1,
          animation: "viewer3d-pulse 1.5s ease-in-out infinite",
        }}>
          <div style={{
            width: 20,
            height: 20,
            border: `2px solid ${colors.border}`,
            borderTopColor: colors.accent,
            borderRadius: "50%",
            animation: "viewer3d-spin 0.8s linear infinite",
          }} />
          Loading animation...
          <style>{`
            @keyframes viewer3d-spin { to { transform: rotate(360deg) } }
            @keyframes viewer3d-pulse { 0%,100% { opacity: 0.3 } 50% { opacity: 0.5 } }
          `}</style>
        </div>
      )}

      {/* 3D Canvas */}
      {animation && (
        <Suspense fallback={
          <div style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.text,
            opacity: 0.3,
            fontSize: 12,
          }}>
            Loading 3D...
          </div>
        }>
          <Canvas
            dpr={[1, maxDpr]}
            camera={{ position: [0, 1.2, 2.8], fov: 45 }}
            frameloop="demand"
            style={{ touchAction: "none" }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 4, 5]} intensity={0.9} castShadow />
            <directionalLight position={[-2, 3, -2]} intensity={0.3} />
            <hemisphereLight args={["#b1e1ff", "#443333", 0.3]} />
            <Suspense fallback={null}>
              <ExerciseScene3D
                animation={animation}
                playing={playing}
                speed={speed}
                onReady={() => setReady(true)}
                onProgress={onProgress}
                resetCamera={resetCamera}
                accentColor={colors.accent}
              />
            </Suspense>
          </Canvas>
        </Suspense>
      )}

      {/* Playback controls overlay */}
      {ready && animation && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          pointerEvents: "none",
        }}>
          {/* Progress bar */}
          <div style={{
            height: 3,
            background: "rgba(255,255,255,0.15)",
            marginLeft: 8,
            marginRight: 8,
            borderRadius: 2,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: colors.accent,
              borderRadius: 2,
              transition: "width 0.1s linear",
            }} />
          </div>

          {/* Button row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px 8px 8px",
          }}>
            {/* Play/Pause */}
            <button
              onClick={() => setPlaying((p) => !p)}
              style={{
                pointerEvents: "auto",
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
              }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,4 20,12 6,20" />
                </svg>
              )}
            </button>

            {/* Speed pills */}
            <div style={{
              pointerEvents: "auto",
              display: "flex",
              gap: 4,
              background: "rgba(0,0,0,0.5)",
              borderRadius: 999,
              padding: 2,
              backdropFilter: "blur(4px)",
            }}>
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  style={{
                    border: "none",
                    background: speed === s ? "rgba(255,255,255,0.25)" : "transparent",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Reset camera */}
            <button
              onClick={() => setResetCamera((c) => c + 1)}
              style={{
                pointerEvents: "auto",
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
              }}
              aria-label="Reset camera"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
