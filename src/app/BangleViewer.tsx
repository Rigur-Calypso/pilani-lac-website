/// <reference types="@react-three/fiber" />
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════════════
   SHARED TYPES & HELPERS
   ═══════════════════════════════════════════════════════════════════════ */
interface BangleProps {
  colors: Record<string, string>;
  thicknessScale: number;
}



/* ═══════════════════════════════════════════════════════════════════════
   BRAID GENERATOR — creates a multi-strand braided torus geometry
   Used for Design 1 (Crimson Twist) and Design 2 (Candy Swirl)
   ═══════════════════════════════════════════════════════════════════════ */
function createBraidStrand(
  majorR: number,
  minorR: number,
  strandOffset: number,
  braidAmplitude: number,
  braidFrequency: number,
  tubularSegments: number,
  radialSegments: number,
  thicknessScale: number
): THREE.BufferGeometry {
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const u = (i / tubularSegments) * Math.PI * 2;

    // Braid: the strand oscillates in and out
    const braidOffset = Math.sin(u * braidFrequency + strandOffset) * braidAmplitude;
    const braidZ = Math.cos(u * braidFrequency + strandOffset) * braidAmplitude * thicknessScale;

    const cx = Math.cos(u) * (majorR + braidOffset);
    const cy = Math.sin(u) * (majorR + braidOffset);
    const cz = braidZ;

    // Tangent along the path
    const du = 0.001;
    const u2 = u + du;
    const braidOffset2 = Math.sin(u2 * braidFrequency + strandOffset) * braidAmplitude;
    const braidZ2 = Math.cos(u2 * braidFrequency + strandOffset) * braidAmplitude * thicknessScale;
    const cx2 = Math.cos(u2) * (majorR + braidOffset2);
    const cy2 = Math.sin(u2) * (majorR + braidOffset2);
    const cz2 = braidZ2;

    const T = new THREE.Vector3(cx2 - cx, cy2 - cy, cz2 - cz).normalize();
    const N = new THREE.Vector3(-cx, -cy, 0).normalize();
    const B = new THREE.Vector3().crossVectors(T, N).normalize();
    N.crossVectors(B, T).normalize();

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const r = minorR * thicknessScale;

      const px = cx + r * (Math.cos(v) * N.x + Math.sin(v) * B.x);
      const py = cy + r * (Math.cos(v) * N.y + Math.sin(v) * B.y);
      const pz = cz + r * (Math.cos(v) * N.z + Math.sin(v) * B.z);

      vertices.push(px, py, pz);

      const nx = Math.cos(v) * N.x + Math.sin(v) * B.x;
      const ny = Math.cos(v) * N.y + Math.sin(v) * B.y;
      const nz = Math.cos(v) * N.z + Math.sin(v) * B.z;
      normals.push(nx, ny, nz);

      uvs.push(i / tubularSegments, j / radialSegments);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}



/* ═══════════════════════════════════════════════════════════════════════
   DESIGN 1 — Crimson Twist (3-strand braid, crimson/maroon with gold lines)
   Editable: Strand Color, Gold Accent
   ═══════════════════════════════════════════════════════════════════════ */
function CrimsonTwist({ colors, thicknessScale }: BangleProps) {
  const strandColor = colors["Strand Color"] || "#8b1a1a";
  const { nodes } = useGLTF('/models/design_1.glb');

  return (
    <group scale={thicknessScale} dispose={null}>
      <mesh 
        geometry={(nodes['tripo_node_39677a46-6a5d-4dce-9dc5-1882ea3cb179'] as THREE.Mesh).geometry} 
      >
        <meshStandardMaterial color={strandColor} roughness={0.15} metalness={0.1} />
      </mesh>
    </group>
  );
}
useGLTF.preload('/models/design_1.glb');

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN 2 — Candy Swirl (3-strand braid, pink + turquoise + gold wire)
   Editable: Strand 1, Strand 2, Gold Wire
   ═══════════════════════════════════════════════════════════════════════ */
function CandySwirl({ colors, thicknessScale }: BangleProps) {
  const color1 = colors["Strand 1"] || "#f0a0b5";
  const color2 = colors["Strand 2"] || "#6bcfc8";

  const strands = useMemo(() => {
    const geoms: THREE.BufferGeometry[] = [];
    for (let s = 0; s < 3; s++) {
      geoms.push(
        createBraidStrand(
          3, 0.32, (s * Math.PI * 2) / 3, 0.38, 10,
          256, 16, thicknessScale
        )
      );
    }
    return geoms;
  }, [thicknessScale]);

  const strandColors = [color1, color2, color1];

  return (
    <group>
      {strands.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial
            color={strandColors[i]}
            roughness={0.18}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MARBLE MATERIAL — custom shader for swirled marble patterns
   Used by Designs 3, 5, 7
   ═══════════════════════════════════════════════════════════════════════ */
function MarbleTorusMaterial({
  color1,
  color2,
  scale = 3.0,
}: {
  color1: string;
  color2: string;
  scale?: number;
}) {
  const uniforms = useMemo(() => ({
    uColor1: { value: new THREE.Color(color1) },
    uColor2: { value: new THREE.Color(color2) },
    uScale: { value: scale },
  }), []);

  React.useEffect(() => {
    uniforms.uColor1.value.set(color1);
    uniforms.uColor2.value.set(color2);
    uniforms.uScale.value = scale;
  }, [color1, color2, scale]);

  return (
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={`
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          vWorldPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uScale;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPos;

        // Simplex noise helper
        vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }

        void main() {
          float n = snoise(vWorldPos * uScale) * 0.5 + 0.5;
          n = n + snoise(vWorldPos * uScale * 2.0) * 0.25;
          n = smoothstep(0.3, 0.7, n);
          vec3 color = mix(uColor1, uColor2, n);

          // Glossy lacquer lighting
          vec3 lightDir = normalize(vec3(5.0, 10.0, 7.0) - vPosition);
          float diff = max(dot(vNormal, lightDir), 0.0);
          vec3 viewDir = normalize(-vPosition);
          vec3 reflectDir = reflect(-lightDir, vNormal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), 48.0);

          vec3 ambient = color * 0.3;
          vec3 diffuse = color * diff * 0.55;
          vec3 specular = vec3(1.0) * spec * 0.35;

          gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
        }
      `}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN 3 — Ocean Marble (smooth torus with swirled marble pattern)
   Editable: Color 1, Color 2
   ═══════════════════════════════════════════════════════════════════════ */
function OceanMarble({ colors, thicknessScale }: BangleProps) {
  return (
    <mesh>
      <torusGeometry args={[3, 0.55 * thicknessScale, 64, 128]} />
      <MarbleTorusMaterial
        color1={colors["Color 1"] || "#f0a0b5"}
        color2={colors["Color 2"] || "#6bcfc8"}
        scale={4.0}
      />
    </mesh>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   DESIGN 5 — Pastel Rope (marble torus with thick gold wire spiral wraps)
   Editable: Marble 1, Marble 2, Gold Wire
   ═══════════════════════════════════════════════════════════════════════ */
function PastelRope({ colors, thicknessScale }: BangleProps) {
  return (
    <group>
      <mesh>
        <torusGeometry args={[3, 0.5 * thicknessScale, 64, 128]} />
        <MarbleTorusMaterial
          color1={colors["Marble 1"] || "#f0a0b5"}
          color2={colors["Marble 2"] || "#6bcfc8"}
          scale={3.0}
        />
      </mesh>
    </group>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   DESIGN 8 — Artisan Wave (sinusoidal wavy bangle with concentric wave stripes)
   Editable: Color 1, Color 2, Color 3, Color 4
   ═══════════════════════════════════════════════════════════════════════ */
function ArtisanWave({ colors, thicknessScale }: BangleProps) {
  const c1 = colors["Color 1"] || "#1a6b1a";
  const c2 = colors["Color 2"] || "#b81818";
  const c3 = colors["Color 3"] || "#d4a010";
  const c4 = colors["Color 4"] || "#90d020";

  const geom = useMemo(() => {
    const g = new THREE.TorusGeometry(3, 0.55 * thicknessScale, 64, 128);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const angle = Math.atan2(y, x);
      const wave = Math.sin(angle * 6) * 0.45 * thicknessScale;
      pos.setZ(i, z + wave);
    }
    g.computeVertexNormals();
    return g;
  }, [thicknessScale]);

  const uniforms = useMemo(() => ({
    uColors: { value: [c1, c2, c3, c4].map(c => new THREE.Color(c)) },
    uColorCount: { value: 4 },
  }), []);

  React.useEffect(() => {
    uniforms.uColors.value = [c1, c2, c3, c4].map(c => new THREE.Color(c));
  }, [c1, c2, c3, c4]);

  return (
    <mesh geometry={geom}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColors[4];
          uniform int uColorCount;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            // Concentric wave stripes along the radial UV
            float stripe = fract(vUv.y * 12.0);
            int idx = int(stripe * float(uColorCount));
            idx = min(idx, uColorCount - 1);
            vec3 color = uColors[idx];

            vec3 lightDir = normalize(vec3(5.0, 10.0, 7.0) - vPosition);
            float diff = max(dot(vNormal, lightDir), 0.0);
            vec3 viewDir = normalize(-vPosition);
            vec3 reflectDir = reflect(-lightDir, vNormal);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), 48.0);

            vec3 ambient = color * 0.3;
            vec3 diffuse = color * diff * 0.55;
            vec3 specular = vec3(1.0) * spec * 0.35;

            gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MODEL REGISTRY & DESIGN TEMPLATES
   ═══════════════════════════════════════════════════════════════════════ */
const MODELS: Record<number, React.FC<BangleProps>> = {
  1: CrimsonTwist,
  2: CandySwirl,
  3: OceanMarble,
  5: PastelRope,
  8: ArtisanWave,
};

export const DESIGN_TEMPLATES = {
  1: { id: 1, name: "Crimson Twist", img: "/products/product-01.png", regions: { "Strand Color": "#8b1a1a" } },
  2: { id: 2, name: "Candy Swirl", img: "/products/product-02.png", regions: { "Strand 1": "#f0a0b5", "Strand 2": "#6bcfc8" } },
  3: { id: 3, name: "Ocean Marble", img: "/products/product-03.png", regions: { "Color 1": "#f0a0b5", "Color 2": "#6bcfc8" } },
  5: { id: 5, name: "Pastel Rope", img: "/products/product-05.png", regions: { "Marble 1": "#f0a0b5", "Marble 2": "#6bcfc8" } },
  8: { id: 8, name: "Artisan Wave", img: "/products/product-08.png", regions: { "Color 1": "#1a6b1a", "Color 2": "#b81818", "Color 3": "#d4a010", "Color 4": "#90d020" } },
};

/* ═══════════════════════════════════════════════════════════════════════
   IDLE ROTATION WRAPPER
   ═══════════════════════════════════════════════════════════════════════ */
function IdleRotator({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1 + 0.3;
    }
  });
  return <group ref={ref}>{children}</group>;
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN VIEWER EXPORT
   ═══════════════════════════════════════════════════════════════════════ */
export function BangleViewer({ designId, colors, width }: { designId: number; colors: Record<string, string>; width: string }) {
  const Model = MODELS[designId] || MODELS[1];
  const thicknessScale = width === "Wide (12mm)" ? 1.4 : width === "Thin (4mm)" ? 0.7 : 1.0;

  return (
    <Canvas camera={{ position: [0, 3, 10], fov: 40 }} shadows gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={16}
        dampingFactor={0.05}
      />
      <IdleRotator>
        <React.Suspense fallback={null}>
          <Model colors={colors} thicknessScale={thicknessScale} />
        </React.Suspense>
      </IdleRotator>
    </Canvas>
  );
}
