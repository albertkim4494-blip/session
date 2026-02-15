/**
 * Inner R3F scene — only imported lazily inside <Canvas>.
 * Code-split with Three.js and only evaluated inside the R3F tree.
 *
 * The mannequin is built from shaped primitives with anatomical proportions.
 * Equipment props (bench, barbell, dumbbells, etc.) are rendered based on
 * the animation's `props` field and dynamically follow the hand bones.
 */
import { useRef, useEffect } from "react";
import { useFrame, useThree, invalidate } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ── Shared materials ────────────────────────────────────────────────────────
const bodyColor = new THREE.Color(0.55, 0.6, 0.68);
const bodyMat = new THREE.MeshPhysicalMaterial({
  color: bodyColor, roughness: 0.45, metalness: 0.05,
  clearcoat: 0.3, clearcoatRoughness: 0.4,
});
const jointMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0.42, 0.46, 0.52), roughness: 0.5,
  metalness: 0.08, clearcoat: 0.2,
});
const equipMat = new THREE.MeshStandardMaterial({
  color: 0x2a2a35, roughness: 0.3, metalness: 0.7,
});
const padMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a24, roughness: 0.8, metalness: 0.05,
});
const plateMat = new THREE.MeshStandardMaterial({
  color: 0x333340, roughness: 0.4, metalness: 0.6,
});

// ── Procedural mannequin ────────────────────────────────────────────────────
function createMannequin() {
  const root = new THREE.Group();
  const bones = {};

  function makeBone(name, parent, pos) {
    const b = new THREE.Bone();
    b.name = name;
    b.position.set(...pos);
    if (parent) parent.add(b);
    bones[name] = b;
    return b;
  }

  const hips = makeBone("Hips", null, [0, 1.0, 0]);
  const spine = makeBone("Spine", hips, [0, 0.08, 0]);
  const spine1 = makeBone("Spine1", spine, [0, 0.1, 0]);
  const spine2 = makeBone("Spine2", spine1, [0, 0.1, 0]);
  const neck = makeBone("Neck", spine2, [0, 0.1, 0]);
  makeBone("Head", neck, [0, 0.06, 0]);

  const lShoulder = makeBone("LeftShoulder", spine2, [-0.06, 0.08, 0]);
  const lArm = makeBone("LeftArm", lShoulder, [-0.1, -0.02, 0]);
  const lForeArm = makeBone("LeftForeArm", lArm, [0, -0.26, 0]);
  makeBone("LeftHand", lForeArm, [0, -0.24, 0]);

  const rShoulder = makeBone("RightShoulder", spine2, [0.06, 0.08, 0]);
  const rArm = makeBone("RightArm", rShoulder, [0.1, -0.02, 0]);
  const rForeArm = makeBone("RightForeArm", rArm, [0, -0.26, 0]);
  makeBone("RightHand", rForeArm, [0, -0.24, 0]);

  const lUpLeg = makeBone("LeftUpLeg", hips, [-0.09, -0.04, 0]);
  const lLeg = makeBone("LeftLeg", lUpLeg, [0, -0.43, 0]);
  makeBone("LeftFoot", lLeg, [0, -0.42, 0.04]);
  const rUpLeg = makeBone("RightUpLeg", hips, [0.09, -0.04, 0]);
  const rLeg = makeBone("RightLeg", rUpLeg, [0, -0.43, 0]);
  makeBone("RightFoot", rLeg, [0, -0.42, 0.04]);

  const boneList = [];
  hips.traverse((c) => { if (c.isBone) boneList.push(c); });
  const skeleton = new THREE.Skeleton(boneList);

  function addPart(geom, boneName, mat, ox = 0, oy = 0, oz = 0) {
    const boneIdx = boneList.indexOf(bones[boneName]);
    if (boneIdx < 0) return;
    const mesh = new THREE.SkinnedMesh(geom, mat || bodyMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const count = geom.attributes.position.count;
    const si = new Uint16Array(count * 4);
    const sw = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) { si[i * 4] = boneIdx; sw[i * 4] = 1; }
    geom.setAttribute("skinIndex", new THREE.BufferAttribute(si, 4));
    geom.setAttribute("skinWeight", new THREE.Float32BufferAttribute(sw, 4));
    mesh.bind(skeleton);
    geom.translate(ox, oy, oz);
    root.add(mesh);
  }

  const cap = (r, len, rs = 12, cs = 6) => new THREE.CapsuleGeometry(r, len, cs, rs);

  // Torso
  addPart(cap(0.125, 0.08), "Spine", null, 0, 0.06, 0);
  addPart(cap(0.14, 0.1), "Spine1", null, 0, 0.05, 0);
  addPart(cap(0.145, 0.06), "Spine2", null, 0, 0.03, 0);
  addPart(cap(0.13, 0.05), "Hips", null, 0, -0.01, 0);

  // Head & Neck
  const headGeom = new THREE.SphereGeometry(0.09, 16, 12);
  headGeom.scale(1, 1.08, 1);
  addPart(headGeom, "Head", null, 0, 0.07, 0);
  addPart(cap(0.04, 0.04, 10), "Neck", null, 0, 0.03, 0);

  // Shoulders
  addPart(new THREE.SphereGeometry(0.055, 10, 8), "LeftShoulder", null, -0.08, -0.01, 0);
  addPart(new THREE.SphereGeometry(0.055, 10, 8), "RightShoulder", null, 0.08, -0.01, 0);

  // Arms
  addPart(cap(0.045, 0.16), "LeftArm", null, 0, -0.12, 0);
  addPart(cap(0.045, 0.16), "RightArm", null, 0, -0.12, 0);
  addPart(new THREE.SphereGeometry(0.035, 8, 6), "LeftForeArm", jointMat, 0, 0.01, 0);
  addPart(new THREE.SphereGeometry(0.035, 8, 6), "RightForeArm", jointMat, 0, 0.01, 0);
  addPart(cap(0.038, 0.14), "LeftForeArm", null, 0, -0.1, 0);
  addPart(cap(0.038, 0.14), "RightForeArm", null, 0, -0.1, 0);
  const hg = () => new THREE.BoxGeometry(0.04, 0.06, 0.025, 2, 2, 1);
  addPart(hg(), "LeftHand", null, 0, -0.04, 0);
  addPart(hg(), "RightHand", null, 0, -0.04, 0);

  // Legs
  addPart(cap(0.065, 0.28), "LeftUpLeg", null, 0, -0.2, 0);
  addPart(cap(0.065, 0.28), "RightUpLeg", null, 0, -0.2, 0);
  addPart(new THREE.SphereGeometry(0.045, 8, 6), "LeftLeg", jointMat, 0, 0.01, 0);
  addPart(new THREE.SphereGeometry(0.045, 8, 6), "RightLeg", jointMat, 0, 0.01, 0);
  addPart(cap(0.05, 0.26), "LeftLeg", null, 0, -0.2, 0);
  addPart(cap(0.05, 0.26), "RightLeg", null, 0, -0.2, 0);
  const fg = () => new THREE.BoxGeometry(0.07, 0.04, 0.15, 2, 1, 2);
  addPart(fg(), "LeftFoot", null, 0, -0.02, 0.04);
  addPart(fg(), "RightFoot", null, 0, -0.02, 0.04);

  root.add(hips);
  return { root, bones, skeleton };
}

// ── Equipment creation ──────────────────────────────────────────────────────

function createBench() {
  const group = new THREE.Group();
  // Pad (top)
  const pad = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.06, 1.2),
    padMat
  );
  pad.position.set(0, 0.44, 0.15);
  pad.castShadow = true;
  group.add(pad);
  // Frame (legs)
  const legGeom = new THREE.BoxGeometry(0.04, 0.41, 0.04);
  for (const [x, z] of [[-0.12, -0.4], [0.12, -0.4], [-0.12, 0.7], [0.12, 0.7]]) {
    const leg = new THREE.Mesh(legGeom, equipMat);
    leg.position.set(x, 0.21, z);
    leg.castShadow = true;
    group.add(leg);
  }
  // Cross bar
  const crossbar = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.04, 1.1),
    equipMat
  );
  crossbar.position.set(0, 0.02, 0.15);
  group.add(crossbar);
  return group;
}

function createBarbell() {
  const group = new THREE.Group();
  // Bar shaft
  const bar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 1.4, 8),
    equipMat
  );
  bar.rotation.z = Math.PI / 2; // horizontal
  group.add(bar);
  // Weight plates (each end)
  const plateGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.035, 12);
  for (const side of [-1, 1]) {
    const plate = new THREE.Mesh(plateGeom, plateMat);
    plate.rotation.z = Math.PI / 2;
    plate.position.x = side * 0.62;
    plate.castShadow = true;
    group.add(plate);
    // Outer plate
    const plate2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12),
      equipMat
    );
    plate2.rotation.z = Math.PI / 2;
    plate2.position.x = side * 0.66;
    group.add(plate2);
  }
  return group;
}

function createDumbbell() {
  const group = new THREE.Group();
  // Handle
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6),
    equipMat
  );
  group.add(handle);
  // Weights
  const wGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.025, 8);
  for (const side of [-1, 1]) {
    const w = new THREE.Mesh(wGeom, plateMat);
    w.position.y = side * 0.06;
    w.castShadow = true;
    group.add(w);
  }
  return group;
}

function createPullupBar() {
  const group = new THREE.Group();
  // Horizontal bar
  const bar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8),
    equipMat
  );
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, 2.15, 0);
  group.add(bar);
  // Vertical supports
  const supportGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6);
  for (const x of [-0.35, 0.35]) {
    const s = new THREE.Mesh(supportGeom, equipMat);
    s.position.set(x, 1.9, 0);
    group.add(s);
  }
  return group;
}

function createCableHigh() {
  const group = new THREE.Group();
  // Vertical post
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 2.2, 0.06),
    equipMat
  );
  post.position.set(0, 1.1, -0.6);
  group.add(post);
  // Top crossbar
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.04, 0.04),
    equipMat
  );
  top.position.set(0, 2.2, -0.6);
  group.add(top);
  // Pulley indicator
  const pulley = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 8, 6),
    plateMat
  );
  pulley.position.set(0, 2.18, -0.57);
  group.add(pulley);
  return group;
}

function createSeat() {
  const group = new THREE.Group();
  const pad = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.05, 0.35),
    padMat
  );
  pad.position.set(0, 0.55, 0);
  pad.castShadow = true;
  group.add(pad);
  // Back pad (slightly reclined)
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.5, 0.04),
    padMat
  );
  back.position.set(0, 0.82, 0.16);
  back.rotation.x = -0.15;
  group.add(back);
  // Base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.53, 0.05),
    equipMat
  );
  base.position.set(0, 0.28, 0.08);
  group.add(base);
  return group;
}

function createDipBars() {
  const group = new THREE.Group();
  const barGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
  for (const x of [-0.2, 0.2]) {
    // Horizontal gripping bars
    const bar = new THREE.Mesh(barGeom, equipMat);
    bar.rotation.x = Math.PI / 2;
    bar.position.set(x, 1.15, 0);
    group.add(bar);
    // Support legs
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.15, 6),
      equipMat
    );
    leg.position.set(x, 0.575, -0.2);
    group.add(leg);
    const leg2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.15, 6),
      equipMat
    );
    leg2.position.set(x, 0.575, 0.2);
    group.add(leg2);
  }
  return group;
}

const EQUIP_CREATORS = {
  bench: createBench,
  barbell: createBarbell,
  dumbbells: null, // handled specially (two instances)
  "pullup-bar": createPullupBar,
  "cable-high": createCableHigh,
  seat: createSeat,
  "dip-bars": createDipBars,
};

// ── Keyframe interpolation ─────────────────────────────────────────────────
function interpolateKeyframes(keyframes, normalizedTime) {
  let k0 = keyframes[keyframes.length - 1];
  let k1 = keyframes[0];
  let localT = 0;

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (normalizedTime >= keyframes[i].time && normalizedTime <= keyframes[i + 1].time) {
      k0 = keyframes[i];
      k1 = keyframes[i + 1];
      const span = k1.time - k0.time;
      localT = span > 0 ? (normalizedTime - k0.time) / span : 0;
      break;
    }
  }

  const t = localT * localT * (3 - 2 * localT);
  const result = {};
  const allBones = new Set([...Object.keys(k0.bones || {}), ...Object.keys(k1.bones || {})]);
  for (const bone of allBones) {
    const a = k0.bones?.[bone] || [0, 0, 0];
    const b = k1.bones?.[bone] || [0, 0, 0];
    result[bone] = [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
  }
  return result;
}

// ── Camera helpers ──────────────────────────────────────────────────────────
const DEFAULT_CAM_STAND = [0, 1.2, 2.8];
const DEFAULT_CAM_LYING = [1.8, 1.8, 1.8]; // side-angled view for bench/floor

function CameraReset({ controlsRef, resetTrigger, lying }) {
  const { camera } = useThree();
  useEffect(() => {
    const pos = lying ? DEFAULT_CAM_LYING : DEFAULT_CAM_STAND;
    const target = lying ? [0, 1.0, 0.2] : [0, 0.95, 0];
    if (controlsRef.current) {
      camera.position.set(...pos);
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
      invalidate();
    }
  }, [resetTrigger, lying, camera, controlsRef]);
  return null;
}

// ── Ground plane ────────────────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <circleGeometry args={[1.2, 32]} />
      <meshStandardMaterial color={0x444444} transparent opacity={0.12} />
    </mesh>
  );
}

// ── Temp vectors (reused each frame) ────────────────────────────────────────
const _lhPos = new THREE.Vector3();
const _rhPos = new THREE.Vector3();
const _midPos = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);

// ── Scene component ────────────────────────────────────────────────────────
export default function ExerciseScene3D({ animation, playing, speed, onReady, onProgress, resetCamera, accentColor }) {
  const groupRef = useRef();
  const bonesRef = useRef(null);
  const clockRef = useRef(0);
  const controlsRef = useRef();

  // Equipment refs
  const equipGroupRef = useRef();
  const barbellRef = useRef(null);
  const lDumbbellRef = useRef(null);
  const rDumbbellRef = useRef(null);
  const cableLineRef = useRef(null);

  // Create mannequin once
  useEffect(() => {
    const { root, bones } = createMannequin();
    bonesRef.current = bones;
    if (groupRef.current) {
      groupRef.current.add(root);
      onReady?.();
    }
    return () => {
      if (groupRef.current) {
        while (groupRef.current.children.length) {
          const child = groupRef.current.children[0];
          groupRef.current.remove(child);
          child.traverse?.((c) => { c.geometry?.dispose(); c.material?.dispose(); });
        }
      }
      bonesRef.current = null;
    };
  }, []);

  // Setup equipment when animation changes
  useEffect(() => {
    clockRef.current = 0;
    barbellRef.current = null;
    lDumbbellRef.current = null;
    rDumbbellRef.current = null;
    cableLineRef.current = null;

    // Reset all bones
    if (bonesRef.current) {
      for (const bone of Object.values(bonesRef.current)) bone.rotation.set(0, 0, 0);
    }

    // Clear old equipment
    const eg = equipGroupRef.current;
    if (eg) {
      while (eg.children.length) {
        const child = eg.children[0];
        eg.remove(child);
        child.traverse?.((c) => { c.geometry?.dispose(); c.material?.dispose(); });
      }
    }

    // Create new equipment
    const props = animation?.props || [];
    if (eg && props.length > 0) {
      for (const propType of props) {
        if (propType === "barbell") {
          const bb = createBarbell();
          barbellRef.current = bb;
          eg.add(bb);
        } else if (propType === "dumbbells") {
          const ld = createDumbbell();
          const rd = createDumbbell();
          lDumbbellRef.current = ld;
          rDumbbellRef.current = rd;
          eg.add(ld);
          eg.add(rd);
        } else if (propType === "cable-high") {
          const cable = createCableHigh();
          eg.add(cable);
          // Create cable line (will be updated in useFrame)
          const lineGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 2.18, -0.57),
            new THREE.Vector3(0, 1.2, 0),
          ]);
          const lineMat = new THREE.LineBasicMaterial({ color: 0x888888 });
          const line = new THREE.Line(lineGeom, lineMat);
          cableLineRef.current = line;
          eg.add(line);
        } else {
          const creator = EQUIP_CREATORS[propType];
          if (creator) eg.add(creator());
        }
      }
    }

    invalidate();
  }, [animation]);

  // Detect if this is a lying-down exercise
  const isLying = animation?.keyframes?.[0]?.bones?.Hips?.[0] < -1;

  useFrame((state, delta) => {
    if (!bonesRef.current || !animation) return;

    if (playing) {
      clockRef.current += delta * speed;
      invalidate();
    }

    const normalizedTime = (clockRef.current % animation.duration) / animation.duration;
    const boneRotations = interpolateKeyframes(animation.keyframes, normalizedTime);

    // Reset all bones, then apply keyframe rotations
    for (const bone of Object.values(bonesRef.current)) bone.rotation.set(0, 0, 0);
    for (const [boneName, rot] of Object.entries(boneRotations)) {
      const bone = bonesRef.current[boneName];
      if (bone) bone.rotation.set(rot[0], rot[1], rot[2]);
    }

    // Update world matrices for bone position queries
    bonesRef.current.Hips.updateWorldMatrix(true, true);

    // Update dynamic equipment positions
    const lh = bonesRef.current.LeftHand;
    const rh = bonesRef.current.RightHand;

    if (barbellRef.current && lh && rh) {
      lh.getWorldPosition(_lhPos);
      rh.getWorldPosition(_rhPos);
      _midPos.lerpVectors(_lhPos, _rhPos, 0.5);
      barbellRef.current.position.copy(_midPos);

      // Orient barbell to face from left hand to right hand
      _dir.subVectors(_rhPos, _lhPos).normalize();
      _quat.setFromUnitVectors(_up, _dir);
      barbellRef.current.quaternion.copy(_quat);
    }

    if (lDumbbellRef.current && lh) {
      lh.getWorldPosition(_lhPos);
      lDumbbellRef.current.position.copy(_lhPos);
      // Orient dumbbell along the forearm direction
      const lfa = bonesRef.current.LeftForeArm;
      if (lfa) {
        lfa.getWorldPosition(_dir);
        _dir.sub(_lhPos).normalize();
        _quat.setFromUnitVectors(_up, _dir);
        lDumbbellRef.current.quaternion.copy(_quat);
      }
    }

    if (rDumbbellRef.current && rh) {
      rh.getWorldPosition(_rhPos);
      rDumbbellRef.current.position.copy(_rhPos);
      const rfa = bonesRef.current.RightForeArm;
      if (rfa) {
        rfa.getWorldPosition(_dir);
        _dir.sub(_rhPos).normalize();
        _quat.setFromUnitVectors(_up, _dir);
        rDumbbellRef.current.quaternion.copy(_quat);
      }
    }

    // Update cable line to follow hand midpoint
    if (cableLineRef.current && lh && rh) {
      lh.getWorldPosition(_lhPos);
      rh.getWorldPosition(_rhPos);
      _midPos.lerpVectors(_lhPos, _rhPos, 0.5);
      const positions = cableLineRef.current.geometry.attributes.position;
      positions.setXYZ(1, _midPos.x, _midPos.y, _midPos.z);
      positions.needsUpdate = true;
    }

    onProgress?.(normalizedTime);
  });

  return (
    <>
      <group ref={groupRef} />
      <group ref={equipGroupRef} />
      <Ground />
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        target={isLying ? [0, 1.0, 0.2] : [0, 0.95, 0]}
        onChange={() => invalidate()}
      />
      <CameraReset
        controlsRef={controlsRef}
        resetTrigger={resetCamera || 0}
        lying={isLying}
      />
    </>
  );
}
