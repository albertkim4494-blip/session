/**
 * Inner scene for Pose Editor — imports Three.js, only loaded lazily.
 * Renders the mannequin and applies either a static pose or animation.
 */
import { useRef, useEffect } from "react";
import { useFrame, useThree, invalidate } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Import the mannequin creation and interpolation from ExerciseScene3D
// We re-implement here to avoid circular deps and keep it self-contained

function createMannequin() {
  const root = new THREE.Group();
  const bodyColor = new THREE.Color(0.55, 0.6, 0.68);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: bodyColor,
    roughness: 0.45,
    metalness: 0.05,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
  });

  const jointMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.42, 0.46, 0.52),
    roughness: 0.5,
    metalness: 0.08,
    clearcoat: 0.2,
  });

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

  function addPart(geom, boneName, mat, offsetX = 0, offsetY = 0, offsetZ = 0) {
    const boneIdx = boneList.indexOf(bones[boneName]);
    if (boneIdx < 0) return;
    const mesh = new THREE.SkinnedMesh(geom, mat || bodyMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const count = geom.attributes.position.count;
    const skinIndices = new Uint16Array(count * 4);
    const skinWeights = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      skinIndices[i * 4] = boneIdx;
      skinWeights[i * 4] = 1;
    }
    geom.setAttribute("skinIndex", new THREE.BufferAttribute(skinIndices, 4));
    geom.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));
    mesh.bind(skeleton);
    geom.translate(offsetX, offsetY, offsetZ);
    root.add(mesh);
  }

  const cap = (r, len, rs = 12, cs = 6) => new THREE.CapsuleGeometry(r, len, cs, rs);

  addPart(cap(0.125, 0.08), "Spine", bodyMat, 0, 0.06, 0);
  addPart(cap(0.14, 0.1), "Spine1", bodyMat, 0, 0.05, 0);
  addPart(cap(0.145, 0.06), "Spine2", bodyMat, 0, 0.03, 0);
  addPart(cap(0.13, 0.05), "Hips", bodyMat, 0, -0.01, 0);

  const headGeom = new THREE.SphereGeometry(0.09, 16, 12);
  headGeom.scale(1, 1.08, 1);
  addPart(headGeom, "Head", bodyMat, 0, 0.07, 0);
  addPart(cap(0.04, 0.04, 10), "Neck", bodyMat, 0, 0.03, 0);

  addPart(new THREE.SphereGeometry(0.055, 10, 8), "LeftShoulder", bodyMat, -0.08, -0.01, 0);
  addPart(new THREE.SphereGeometry(0.055, 10, 8), "RightShoulder", bodyMat, 0.08, -0.01, 0);

  addPart(cap(0.045, 0.16), "LeftArm", bodyMat, 0, -0.12, 0);
  addPart(cap(0.045, 0.16), "RightArm", bodyMat, 0, -0.12, 0);
  addPart(new THREE.SphereGeometry(0.035, 8, 6), "LeftForeArm", jointMat, 0, 0.01, 0);
  addPart(new THREE.SphereGeometry(0.035, 8, 6), "RightForeArm", jointMat, 0, 0.01, 0);
  addPart(cap(0.038, 0.14), "LeftForeArm", bodyMat, 0, -0.1, 0);
  addPart(cap(0.038, 0.14), "RightForeArm", bodyMat, 0, -0.1, 0);

  const handGeom = () => new THREE.BoxGeometry(0.04, 0.06, 0.025, 2, 2, 1);
  addPart(handGeom(), "LeftHand", bodyMat, 0, -0.04, 0);
  addPart(handGeom(), "RightHand", bodyMat, 0, -0.04, 0);

  addPart(cap(0.065, 0.28), "LeftUpLeg", bodyMat, 0, -0.2, 0);
  addPart(cap(0.065, 0.28), "RightUpLeg", bodyMat, 0, -0.2, 0);
  addPart(new THREE.SphereGeometry(0.045, 8, 6), "LeftLeg", jointMat, 0, 0.01, 0);
  addPart(new THREE.SphereGeometry(0.045, 8, 6), "RightLeg", jointMat, 0, 0.01, 0);
  addPart(cap(0.05, 0.26), "LeftLeg", bodyMat, 0, -0.2, 0);
  addPart(cap(0.05, 0.26), "RightLeg", bodyMat, 0, -0.2, 0);

  const footGeom = () => new THREE.BoxGeometry(0.07, 0.04, 0.15, 2, 1, 2);
  addPart(footGeom(), "LeftFoot", bodyMat, 0, -0.02, 0.04);
  addPart(footGeom(), "RightFoot", bodyMat, 0, -0.02, 0.04);

  root.add(hips);
  return { root, bones, skeleton };
}

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

export default function PoseEditorScene({ animation, staticPose, playing }) {
  const groupRef = useRef();
  const bonesRef = useRef(null);
  const clockRef = useRef(0);

  useEffect(() => {
    const { root, bones } = createMannequin();
    bonesRef.current = bones;
    if (groupRef.current) {
      groupRef.current.add(root);
    }
    invalidate();
    return () => {
      if (groupRef.current) {
        while (groupRef.current.children.length) {
          const child = groupRef.current.children[0];
          groupRef.current.remove(child);
          child.traverse?.((c) => {
            c.geometry?.dispose();
            c.material?.dispose();
          });
        }
      }
      bonesRef.current = null;
    };
  }, []);

  // Apply static pose when not playing
  useEffect(() => {
    if (!bonesRef.current || playing) return;
    // Reset all bones first
    for (const bone of Object.values(bonesRef.current)) {
      bone.rotation.set(0, 0, 0);
    }
    if (staticPose) {
      for (const [name, rot] of Object.entries(staticPose)) {
        const bone = bonesRef.current[name];
        if (bone) bone.rotation.set(rot[0], rot[1], rot[2]);
      }
    }
    invalidate();
  }, [staticPose, playing]);

  useEffect(() => {
    clockRef.current = 0;
  }, [animation]);

  useFrame((_, delta) => {
    if (!bonesRef.current || !animation || !playing) return;

    clockRef.current += delta;
    invalidate();

    const normalizedTime = (clockRef.current % animation.duration) / animation.duration;
    const boneRotations = interpolateKeyframes(animation.keyframes, normalizedTime);

    for (const bone of Object.values(bonesRef.current)) {
      bone.rotation.set(0, 0, 0);
    }
    for (const [name, rot] of Object.entries(boneRotations)) {
      const bone = bonesRef.current[name];
      if (bone) bone.rotation.set(rot[0], rot[1], rot[2]);
    }
  });

  return (
    <>
      <group ref={groupRef} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial color={0x444444} transparent opacity={0.15} />
      </mesh>
      <OrbitControls
        target={[0, 0.95, 0]}
        onChange={() => invalidate()}
      />
    </>
  );
}
