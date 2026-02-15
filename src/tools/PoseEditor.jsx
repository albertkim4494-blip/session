/**
 * Pose Editor — dev tool for creating/editing 3D exercise animations.
 * Access at ?pose-editor (dev mode only).
 *
 * - Adjust bone rotations with sliders
 * - Mirror left/right limbs
 * - Define keyframes, preview animation loop
 * - Export JSON for animationData.js
 */
import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { BONE_NAMES, ANIMATIONS } from "../lib/animationData";

// Lazy-load Three.js canvas
const Canvas = React.lazy(() =>
  import("@react-three/fiber").then((m) => ({ default: m.Canvas }))
);
const EditorScene = React.lazy(() => import("./PoseEditorScene"));

// ── Bone groups for UI organization ──────────────────────────────────────────
const BONE_GROUPS = [
  { label: "Hips & Spine", bones: ["Hips", "Spine", "Spine1", "Spine2"] },
  { label: "Head", bones: ["Neck", "Head"] },
  { label: "Left Arm", bones: ["LeftShoulder", "LeftArm", "LeftForeArm", "LeftHand"] },
  { label: "Right Arm", bones: ["RightShoulder", "RightArm", "RightForeArm", "RightHand"] },
  { label: "Left Leg", bones: ["LeftUpLeg", "LeftLeg", "LeftFoot"] },
  { label: "Right Leg", bones: ["RightUpLeg", "RightLeg", "RightFoot"] },
];

// Mirror mapping
const MIRROR_MAP = {
  LeftShoulder: "RightShoulder", RightShoulder: "LeftShoulder",
  LeftArm: "RightArm", RightArm: "LeftArm",
  LeftForeArm: "RightForeArm", RightForeArm: "LeftForeArm",
  LeftHand: "RightHand", RightHand: "LeftHand",
  LeftUpLeg: "RightUpLeg", RightUpLeg: "LeftUpLeg",
  LeftLeg: "RightLeg", RightLeg: "LeftLeg",
  LeftFoot: "RightFoot", RightFoot: "LeftFoot",
};

const D = Math.PI / 180;

function emptyPose() {
  const p = {};
  for (const name of BONE_NAMES) p[name] = [0, 0, 0];
  return p;
}

function poseFromKeyframe(kfBones) {
  const p = emptyPose();
  for (const [bone, rot] of Object.entries(kfBones || {})) {
    if (p[bone]) p[bone] = [...rot];
  }
  return p;
}

function poseToBones(pose) {
  const bones = {};
  for (const [name, rot] of Object.entries(pose)) {
    if (rot[0] !== 0 || rot[1] !== 0 || rot[2] !== 0) {
      bones[name] = [...rot];
    }
  }
  return bones;
}

function formatDeg(rad) {
  return Math.round(rad / D);
}

function generateCode(keyframes, duration) {
  const lines = [];
  lines.push(`{`);
  lines.push(`  duration: ${duration}, loop: true,`);
  lines.push(`  keyframes: [`);
  for (const kf of keyframes) {
    const bones = poseToBones(kf.pose);
    const entries = Object.entries(bones);
    if (entries.length === 0) {
      lines.push(`    { time: ${kf.time}, bones: {} },`);
    } else {
      lines.push(`    { time: ${kf.time}, bones: {`);
      for (const [name, rot] of entries) {
        const vals = rot.map(v => {
          const deg = Math.round(v / D);
          return deg === 0 ? "0" : `${deg} * D`;
        }).join(", ");
        lines.push(`      ${name}: [${vals}],`);
      }
      lines.push(`    }},`);
    }
  }
  lines.push(`  ],`);
  lines.push(`}`);
  return lines.join("\n");
}

// ── Slider component ─────────────────────────────────────────────────────────
function BoneSlider({ bone, axis, value, onChange }) {
  const axisLabel = ["X (pitch)", "Y (yaw)", "Z (roll)"][axis];
  const deg = formatDeg(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
      <span style={{ width: 62, textAlign: "right", opacity: 0.6 }}>{axisLabel}</span>
      <input
        type="range"
        min={-180}
        max={180}
        value={deg}
        onChange={(e) => onChange(bone, axis, Number(e.target.value) * D)}
        style={{ flex: 1, accentColor: "#7dd3fc" }}
      />
      <span style={{ width: 36, textAlign: "right", fontFamily: "monospace" }}>{deg}°</span>
    </div>
  );
}

// ── Main Pose Editor ────────────────────────────────────────────────────────
export default function PoseEditor() {
  const [keyframes, setKeyframes] = useState([
    { time: 0, pose: emptyPose() },
    { time: 0.5, pose: emptyPose() },
    { time: 1.0, pose: emptyPose() },
  ]);
  const [activeKf, setActiveKf] = useState(0);
  const [duration, setDuration] = useState(2.0);
  const [playing, setPlaying] = useState(false);
  const [mirrorMode, setMirrorMode] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [loadAnimId, setLoadAnimId] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");

  const currentPose = keyframes[activeKf]?.pose || emptyPose();

  // Build animation object for preview
  const previewAnimation = playing ? {
    duration,
    loop: true,
    keyframes: keyframes.map(kf => ({
      time: kf.time,
      bones: poseToBones(kf.pose),
    })),
  } : null;

  // Static pose for when not playing
  const staticPose = !playing ? poseToBones(currentPose) : null;

  const updateBone = useCallback((bone, axis, value) => {
    setKeyframes(prev => {
      const next = [...prev];
      const kf = { ...next[activeKf] };
      const pose = { ...kf.pose };
      pose[bone] = [...pose[bone]];
      pose[bone][axis] = value;

      // Mirror
      if (mirrorMode && MIRROR_MAP[bone]) {
        const mirrorBone = MIRROR_MAP[bone];
        pose[mirrorBone] = [...pose[mirrorBone]];
        // Z-roll is inverted for mirrored limbs
        if (axis === 2) {
          pose[mirrorBone][axis] = -value;
        } else {
          pose[mirrorBone][axis] = value;
        }
      }

      kf.pose = pose;
      next[activeKf] = kf;
      return next;
    });
  }, [activeKf, mirrorMode]);

  const resetPose = useCallback(() => {
    setKeyframes(prev => {
      const next = [...prev];
      next[activeKf] = { ...next[activeKf], pose: emptyPose() };
      return next;
    });
  }, [activeKf]);

  const addKeyframe = useCallback(() => {
    setKeyframes(prev => {
      const lastTime = prev[prev.length - 1]?.time || 0;
      const newTime = Math.min(lastTime + 0.25, 1.0);
      // Copy current active keyframe's pose
      const newPose = { ...prev[activeKf].pose };
      for (const k of Object.keys(newPose)) newPose[k] = [...newPose[k]];
      const next = [...prev, { time: newTime, pose: newPose }];
      next.sort((a, b) => a.time - b.time);
      return next;
    });
  }, [activeKf]);

  const deleteKeyframe = useCallback(() => {
    if (keyframes.length <= 2) return;
    setKeyframes(prev => {
      const next = prev.filter((_, i) => i !== activeKf);
      return next;
    });
    setActiveKf(prev => Math.min(prev, keyframes.length - 2));
  }, [activeKf, keyframes.length]);

  const copyToNextKeyframe = useCallback(() => {
    if (activeKf >= keyframes.length - 1) return;
    setKeyframes(prev => {
      const next = [...prev];
      const srcPose = prev[activeKf].pose;
      const copied = {};
      for (const k of Object.keys(srcPose)) copied[k] = [...srcPose[k]];
      next[activeKf + 1] = { ...next[activeKf + 1], pose: copied };
      return next;
    });
  }, [activeKf, keyframes.length]);

  const loadAnimation = useCallback(() => {
    const anim = ANIMATIONS[loadAnimId];
    if (!anim) return;
    setDuration(anim.duration);
    const kfs = anim.keyframes.map(kf => ({
      time: kf.time,
      pose: poseFromKeyframe(kf.bones),
    }));
    setKeyframes(kfs);
    setActiveKf(0);
    setPlaying(false);
  }, [loadAnimId]);

  const exportCode = useCallback(() => {
    const code = generateCode(keyframes, duration);
    navigator.clipboard.writeText(code).then(() => {
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 2000);
    }).catch(() => {
      setCopyFeedback("Failed to copy");
      setTimeout(() => setCopyFeedback(""), 2000);
    });
  }, [keyframes, duration]);

  const toggleGroup = (label) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const animIdOptions = Object.keys(ANIMATIONS).sort();

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#1a1a2e",
      color: "#e0e0e0",
      fontFamily: "system-ui, -apple-system, sans-serif",
      overflow: "hidden",
    }}>
      {/* Left panel — sliders */}
      <div style={{
        width: 320,
        flexShrink: 0,
        overflowY: "auto",
        padding: "12px",
        borderRight: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        <h2 style={{ margin: 0, fontSize: 16, color: "#7dd3fc" }}>Pose Editor</h2>

        {/* Mirror toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <input
            type="checkbox"
            checked={mirrorMode}
            onChange={(e) => setMirrorMode(e.target.checked)}
          />
          Mirror left/right
        </label>

        {/* Bone groups */}
        {BONE_GROUPS.map(group => (
          <div key={group.label} style={{ background: "#16213e", borderRadius: 8, overflow: "hidden" }}>
            <button
              onClick={() => toggleGroup(group.label)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "6px 10px",
                background: "none",
                border: "none",
                color: "#b0b0b0",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {group.label}
              <span>{collapsedGroups[group.label] ? "+" : "-"}</span>
            </button>
            {!collapsedGroups[group.label] && (
              <div style={{ padding: "0 10px 8px" }}>
                {group.bones.map(bone => (
                  <div key={bone} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#7dd3fc", marginBottom: 2 }}>{bone}</div>
                    {[0, 1, 2].map(axis => (
                      <BoneSlider
                        key={axis}
                        bone={bone}
                        axis={axis}
                        value={currentPose[bone]?.[axis] || 0}
                        onChange={updateBone}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={resetPose}
          style={{
            padding: "6px 12px",
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Reset Current Keyframe
        </button>
      </div>

      {/* Center — 3D viewport */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Suspense fallback={
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3 }}>
              Loading 3D...
            </div>
          }>
            <Canvas
              dpr={[1, 2]}
              camera={{ position: [0, 1.2, 3], fov: 45 }}
              style={{ background: "#0f0f1a" }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[3, 4, 5]} intensity={0.9} />
              <directionalLight position={[-2, 3, -2]} intensity={0.3} />
              <hemisphereLight args={["#b1e1ff", "#443333", 0.3]} />
              <gridHelper args={[4, 20, "#333", "#222"]} position={[0, 0.001, 0]} />
              <Suspense fallback={null}>
                <EditorScene
                  animation={previewAnimation}
                  staticPose={staticPose}
                  playing={playing}
                />
              </Suspense>
            </Canvas>
          </Suspense>
        </div>

        {/* Bottom bar — keyframe timeline + controls */}
        <div style={{
          padding: "10px 16px",
          borderTop: "1px solid #333",
          background: "#16213e",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          {/* Playback controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setPlaying(p => !p)}
              style={{
                padding: "6px 16px",
                background: playing ? "#e74c3c" : "#27ae60",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {playing ? "Stop" : "Play"}
            </button>

            <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              Duration:
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 2)}
                min={0.5}
                max={10}
                step={0.1}
                style={{ width: 50, background: "#1a1a2e", color: "#e0e0e0", border: "1px solid #444", borderRadius: 4, padding: "2px 4px" }}
              />
              s
            </label>

            <div style={{ flex: 1 }} />

            {/* Load existing animation */}
            <select
              value={loadAnimId}
              onChange={(e) => setLoadAnimId(e.target.value)}
              style={{
                background: "#1a1a2e",
                color: "#e0e0e0",
                border: "1px solid #444",
                borderRadius: 4,
                padding: "4px 6px",
                fontSize: 11,
                maxWidth: 200,
              }}
            >
              <option value="">Load animation...</option>
              {animIdOptions.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <button
              onClick={loadAnimation}
              disabled={!loadAnimId}
              style={{
                padding: "4px 10px",
                background: loadAnimId ? "#3498db" : "#333",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: loadAnimId ? "pointer" : "default",
                fontSize: 11,
              }}
            >
              Load
            </button>
          </div>

          {/* Keyframe tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, opacity: 0.6, marginRight: 4 }}>Keyframes:</span>
            {keyframes.map((kf, i) => (
              <button
                key={i}
                onClick={() => { setActiveKf(i); setPlaying(false); }}
                style={{
                  padding: "4px 10px",
                  background: i === activeKf ? "#7dd3fc" : "#1a1a2e",
                  color: i === activeKf ? "#000" : "#ccc",
                  border: "1px solid #444",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: i === activeKf ? 700 : 400,
                  fontSize: 11,
                }}
              >
                t={kf.time}
              </button>
            ))}
            <button
              onClick={addKeyframe}
              style={{
                padding: "4px 8px",
                background: "#1a1a2e",
                color: "#7dd3fc",
                border: "1px solid #7dd3fc",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              +
            </button>
            {keyframes.length > 2 && (
              <button
                onClick={deleteKeyframe}
                style={{
                  padding: "4px 8px",
                  background: "#1a1a2e",
                  color: "#e74c3c",
                  border: "1px solid #e74c3c",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 11,
                }}
              >
                Delete
              </button>
            )}
            <button
              onClick={copyToNextKeyframe}
              disabled={activeKf >= keyframes.length - 1}
              title="Copy pose to next keyframe"
              style={{
                padding: "4px 8px",
                background: "#1a1a2e",
                color: activeKf < keyframes.length - 1 ? "#f0b429" : "#555",
                border: `1px solid ${activeKf < keyframes.length - 1 ? "#f0b429" : "#555"}`,
                borderRadius: 4,
                cursor: activeKf < keyframes.length - 1 ? "pointer" : "default",
                fontSize: 11,
              }}
            >
              Copy to next
            </button>
          </div>

          {/* Export */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={exportCode}
              style={{
                padding: "6px 16px",
                background: "#9b59b6",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              Copy Animation JSON
            </button>
            {copyFeedback && (
              <span style={{ color: "#27ae60", fontSize: 12, fontWeight: 600 }}>{copyFeedback}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
