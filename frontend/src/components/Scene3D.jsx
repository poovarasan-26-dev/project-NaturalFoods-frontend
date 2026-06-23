import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  PerspectiveCamera,
  RoundedBox,
} from '@react-three/drei';
import * as THREE from 'three';

const fruitItems = [
  {
    id: 'strawberry-main',
    type: 'strawberry',
    position: [0.25, 1.15, 0.95],
    bowlPosition: [0.22, 0.42, 0.58],
    rotation: [-0.18, 0.35, -0.05],
    scale: 1.18,
    floatSpeed: 1.2,
  },
  {
    id: 'strawberry-side',
    type: 'strawberry',
    position: [-1.3, 0.8, 0.65],
    bowlPosition: [-1.28, 0.24, 0.42],
    rotation: [0.12, -0.5, 0.15],
    scale: 0.78,
    floatSpeed: 0.95,
  },
  {
    id: 'strawberry-low',
    type: 'strawberry',
    position: [0.9, 0.35, 1.3],
    bowlPosition: [1.08, 0.06, 0.92],
    rotation: [0.1, 0.15, -0.18],
    scale: 0.74,
    floatSpeed: 0.9,
  },
  {
    id: 'mango-a',
    type: 'mangoCube',
    position: [-0.2, 0.65, 1.35],
    bowlPosition: [-0.35, 0.2, 0.98],
    rotation: [0.25, 0.2, 0.18],
    scale: 1,
    floatSpeed: 1.1,
  },
  {
    id: 'mango-b',
    type: 'mangoCube',
    position: [1.45, 0.7, 0.6],
    bowlPosition: [1.38, 0.22, 0.28],
    rotation: [0.22, -0.35, -0.1],
    scale: 0.94,
    floatSpeed: 0.88,
  },
  {
    id: 'mango-c',
    type: 'mangoCube',
    position: [1.2, 0.15, 1.45],
    bowlPosition: [0.72, -0.02, 1.02],
    rotation: [0.3, 0.1, -0.2],
    scale: 0.92,
    floatSpeed: 1.04,
  },
  {
    id: 'grape-a',
    type: 'grape',
    position: [-0.55, 0.95, 0.35],
    bowlPosition: [-0.58, 0.26, 0.12],
    rotation: [0, 0, 0],
    scale: 1.05,
    floatSpeed: 1,
  },
  {
    id: 'grape-b',
    type: 'grape',
    position: [0.75, 0.7, -0.55],
    bowlPosition: [0.82, 0.22, -0.28],
    rotation: [0, 0, 0],
    scale: 1,
    floatSpeed: 0.86,
  },
  {
    id: 'grape-c',
    type: 'grape',
    position: [1.75, 0.18, 0.1],
    bowlPosition: [1.82, -0.06, 0.02],
    rotation: [0, 0, 0],
    scale: 0.95,
    floatSpeed: 1.08,
  },
  {
    id: 'blueberry-a',
    type: 'blueberry',
    position: [-0.62, 0.2, 1.4],
    bowlPosition: [-0.82, -0.06, 1.08],
    rotation: [0, 0, 0],
    scale: 1,
    floatSpeed: 1.22,
  },
  {
    id: 'blueberry-b',
    type: 'blueberry',
    position: [0.1, 0.22, 1.72],
    bowlPosition: [0.08, -0.1, 1.16],
    rotation: [0, 0, 0],
    scale: 0.95,
    floatSpeed: 1.16,
  },
  {
    id: 'blueberry-c',
    type: 'blueberry',
    position: [1.55, 0.4, 1.2],
    bowlPosition: [1.36, -0.02, 0.82],
    rotation: [0, 0, 0],
    scale: 0.9,
    floatSpeed: 1.12,
  },
  {
    id: 'raspberry-a',
    type: 'raspberry',
    position: [-1.2, 0.15, 0.85],
    bowlPosition: [-1.06, -0.06, 0.72],
    rotation: [0, 0.25, 0],
    scale: 0.84,
    floatSpeed: 0.98,
  },
  {
    id: 'raspberry-b',
    type: 'raspberry',
    position: [1.95, 0.55, 0.92],
    bowlPosition: [1.66, 0.06, 0.52],
    rotation: [0, -0.3, 0],
    scale: 0.86,
    floatSpeed: 1.05,
  },
  {
    id: 'lime-a',
    type: 'lime',
    position: [0.35, 0.55, -0.12],
    bowlPosition: [0.2, 0.08, -0.12],
    rotation: [0.1, 0.2, 0],
    scale: 0.9,
    floatSpeed: 1.06,
  },
  {
    id: 'lime-b',
    type: 'lime',
    position: [-1.62, 0.52, 0.2],
    bowlPosition: [-1.42, 0.1, 0.04],
    rotation: [-0.08, -0.15, 0.1],
    scale: 0.75,
    floatSpeed: 0.92,
  },
];

const splashArcs = [
  {
    position: [0.15, 1.35, -0.2],
    rotation: [0.35, 0.1, 0.32],
    size: [2.7, 0.1, 0.72],
    color: '#87ddff',
    speed: 0.5,
  },
  {
    position: [-0.2, 1.62, 0.45],
    rotation: [0.75, 0.52, -0.38],
    size: [1.95, 0.08, 0.58],
    color: '#a7f0ff',
    speed: 0.68,
  },
  {
    position: [0.55, 1.08, 0.82],
    rotation: [0.2, -0.48, 0.84],
    size: [1.55, 0.07, 0.44],
    color: '#d8fbff',
    speed: 0.58,
  },
];

const droplets = [
  { position: [-1.95, 1.28, 0.22], scale: [0.18, 0.3, 0.18], color: '#c9f6ff', speed: 0.8 },
  { position: [-1.4, 1.9, 0.62], scale: [0.12, 0.22, 0.12], color: '#e9fdff', speed: 1.08 },
  { position: [-0.9, 2.08, -0.15], scale: [0.14, 0.24, 0.14], color: '#b7efff', speed: 0.95 },
  { position: [-0.25, 2.28, 0.28], scale: [0.1, 0.18, 0.1], color: '#e8fdff', speed: 1.1 },
  { position: [0.72, 2.15, 0.85], scale: [0.14, 0.26, 0.14], color: '#d0f9ff', speed: 0.88 },
  { position: [1.25, 1.82, 0.15], scale: [0.12, 0.2, 0.12], color: '#edfdff', speed: 1.02 },
  { position: [1.95, 1.3, -0.22], scale: [0.16, 0.27, 0.16], color: '#c7f2ff', speed: 0.78 },
];

function Bowl() {
  const profile = [];

  for (let index = 0; index <= 18; index += 1) {
    const y = -2.15 + index * 0.23;
    const width =
      index < 4
        ? 1.45 + index * 0.16
        : index < 12
          ? 1.95 + (index - 4) * 0.1
          : 2.78 + (index - 12) * 0.05;

    profile.push(new THREE.Vector2(width, y));
  }

  return (
    <group position={[0, -1.2, 0]}>
      <mesh rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <latheGeometry args={[profile, 96]} />
        <meshPhysicalMaterial
          color="#f2f4f7"
          roughness={0.32}
          metalness={0.03}
          clearcoat={0.94}
          clearcoatRoughness={0.18}
          envMapIntensity={1.15}
        />
      </mesh>

      <mesh position={[0, 2.18, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[3.08, 0.18, 24, 120]} />
        <meshPhysicalMaterial
          color="#fafcff"
          roughness={0.2}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

function FruitShell({
  children,
  position,
  bowlPosition,
  rotation,
  scale = 1,
  floatSpeed = 1,
  scrollProgress,
  scrollDirection,
  scrollVelocity,
}) {
  const group = useRef(null);
  const startPosition = useRef(new THREE.Vector3(...position));
  const settledPosition = useRef(new THREE.Vector3(...bowlPosition));
  const temporaryVector = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!group.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    const splashProgress = 1 - scrollProgress;
    const upwardBurst = scrollDirection < 0 ? scrollVelocity * 0.55 : 0;
    const inwardPush = scrollDirection > 0 ? scrollVelocity * 0.14 : 0;
    const swirlOffset = Math.sin(time * floatSpeed + position[0]) * 0.04;
    const target = temporaryVector.current
      .copy(settledPosition.current)
      .lerp(startPosition.current, splashProgress);

    target.y += swirlOffset * (0.3 + splashProgress * 0.7);
    target.x += Math.sin(time * 0.45 + position[2]) * 0.03 * splashProgress;
    target.z += Math.cos(time * 0.35 + position[0]) * 0.035 * splashProgress;

    if (scrollDirection < 0) {
      target.y += upwardBurst * (0.45 + splashProgress * 0.85);
      target.x += (position[0] - bowlPosition[0]) * upwardBurst * 0.14;
      target.z += (position[2] - bowlPosition[2]) * upwardBurst * 0.1;
    }

    if (scrollDirection > 0) {
      target.y -= inwardPush;
    }

    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      target.y,
      0.08,
    );
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, target.x, 0.08);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, target.z, 0.08);

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      rotation[0] + Math.sin(time * 0.55 + position[2]) * (0.02 + splashProgress * 0.06),
      0.08,
    );

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      rotation[1] + time * (0.035 + splashProgress * 0.045),
      0.06,
    );

    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      rotation[2] + Math.cos(time * 0.45 + position[0]) * (0.02 + splashProgress * 0.04),
      0.08,
    );
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.18} floatIntensity={0.18}>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        {children}
      </group>
    </Float>
  );
}

function Strawberry() {
  return (
    <group>
      <mesh castShadow receiveShadow scale={[0.82, 1, 0.82]}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshPhysicalMaterial
          color="#ef4444"
          roughness={0.38}
          metalness={0.05}
          clearcoat={0.62}
          clearcoatRoughness={0.22}
        />
      </mesh>

      <mesh position={[0, 0.46, 0]} rotation={[0.25, 0, 0]} castShadow>
        <coneGeometry args={[0.18, 0.2, 6]} />
        <meshStandardMaterial color="#4d8c3a" />
      </mesh>

      <mesh position={[0.02, 0.33, 0.18]} rotation={[0.55, 0.25, 0]} castShadow>
        <coneGeometry args={[0.06, 0.18, 4]} />
        <meshStandardMaterial color="#66a948" />
      </mesh>
    </group>
  );
}

function MangoCube() {
  return (
    <RoundedBox args={[0.55, 0.55, 0.55]} radius={0.12} smoothness={5} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#ffbf1f"
        roughness={0.28}
        metalness={0.02}
        clearcoat={0.72}
        clearcoatRoughness={0.15}
      />
    </RoundedBox>
  );
}

function Grape() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.28, 40, 40]} />
        <meshPhysicalMaterial
          color="#6d3a78"
          roughness={0.24}
          metalness={0.06}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
        />
      </mesh>
      <mesh position={[0.02, 0.28, 0]} rotation={[0.08, 0, 0.25]} castShadow>
        <cylinderGeometry args={[0.025, 0.02, 0.16, 8]} />
        <meshStandardMaterial color="#648d43" />
      </mesh>
    </group>
  );
}

function Blueberry() {
  return (
    <group>
      <mesh castShadow receiveShadow scale={[1, 0.92, 1]}>
        <sphereGeometry args={[0.2, 36, 36]} />
        <meshPhysicalMaterial
          color="#3659c7"
          roughness={0.3}
          metalness={0.04}
          clearcoat={0.7}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.03, 10]} />
        <meshStandardMaterial color="#20346f" />
      </mesh>
    </group>
  );
}

function Raspberry() {
  return (
    <group>
      <mesh castShadow receiveShadow scale={[1, 0.92, 1]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshPhysicalMaterial
          color="#f43f5e"
          roughness={0.45}
          metalness={0.02}
          clearcoat={0.35}
          clearcoatRoughness={0.28}
        />
      </mesh>
      <mesh position={[0, 0.23, 0]} castShadow>
        <coneGeometry args={[0.08, 0.06, 5]} />
        <meshStandardMaterial color="#8acb5a" />
      </mesh>
    </group>
  );
}

function Lime() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshPhysicalMaterial
          color="#9fcb52"
          roughness={0.28}
          metalness={0.02}
          clearcoat={0.55}
          clearcoatRoughness={0.25}
        />
      </mesh>
      <mesh position={[0.1, 0.05, 0.12]} castShadow>
        <sphereGeometry args={[0.04, 18, 18]} />
        <meshPhysicalMaterial color="#dff5a5" roughness={0.22} metalness={0} clearcoat={0.35} />
      </mesh>
    </group>
  );
}

function FruitModel({ type }) {
  if (type === 'strawberry') {
    return <Strawberry />;
  }

  if (type === 'mangoCube') {
    return <MangoCube />;
  }

  if (type === 'grape') {
    return <Grape />;
  }

  if (type === 'raspberry') {
    return <Raspberry />;
  }

  if (type === 'lime') {
    return <Lime />;
  }

  return <Blueberry />;
}

function SplashArc({ position, rotation, size, color, speed, splashProgress, scrollDirection, scrollVelocity }) {
  const arc = useRef(null);
  const baseScale = useRef(new THREE.Vector3(...size));
  const material = useRef(null);

  useFrame((state) => {
    if (!arc.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    const upwardBurst = scrollDirection < 0 ? scrollVelocity * 0.35 : 0;
    const reveal = THREE.MathUtils.clamp(0.08 + splashProgress * 0.92 + upwardBurst, 0.08, 1.35);

    arc.current.rotation.z = rotation[2] + Math.sin(time * speed) * (0.02 + splashProgress * 0.06);
    arc.current.rotation.x = rotation[0] + Math.cos(time * speed) * (0.015 + splashProgress * 0.03);
    arc.current.position.y = position[1] + upwardBurst * 0.35;
    arc.current.scale.set(
      baseScale.current.x * reveal,
      baseScale.current.y * reveal,
      baseScale.current.z * reveal,
    );

    if (material.current) {
      material.current.opacity = THREE.MathUtils.lerp(material.current.opacity, Math.min(0.95, reveal), 0.12);
    }
  });

  return (
    <mesh ref={arc} position={position} rotation={rotation} scale={size} castShadow>
      <torusGeometry args={[1, 0.16, 18, 120, Math.PI * 1.1]} />
      <meshPhysicalMaterial
        ref={material}
        color={color}
        roughness={0.08}
        metalness={0}
        transmission={0.92}
        thickness={0.55}
        clearcoat={1}
        clearcoatRoughness={0.05}
        ior={1.28}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

function Droplet({ position, scale, color, speed, splashProgress, scrollDirection, scrollVelocity }) {
  const droplet = useRef(null);
  const baseScale = useRef(new THREE.Vector3(...scale));
  const material = useRef(null);

  useFrame((state) => {
    if (!droplet.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    const upwardBurst = scrollDirection < 0 ? scrollVelocity * 0.4 : 0;
    const reveal = THREE.MathUtils.clamp(0.1 + splashProgress * 0.9 + upwardBurst, 0.1, 1.4);

    droplet.current.position.y = position[1] + Math.sin(time * speed + position[0]) * 0.05 + upwardBurst * 0.45;
    droplet.current.rotation.z += 0.003;
    droplet.current.scale.set(
      baseScale.current.x * reveal,
      baseScale.current.y * reveal,
      baseScale.current.z * reveal,
    );

    if (material.current) {
      material.current.opacity = THREE.MathUtils.lerp(material.current.opacity, Math.min(0.9, reveal), 0.12);
    }
  });

  return (
    <mesh ref={droplet} position={position} scale={scale} castShadow>
      <sphereGeometry args={[0.42, 24, 24]} />
      <meshPhysicalMaterial
        ref={material}
        color={color}
        roughness={0.08}
        metalness={0}
        transmission={0.96}
        thickness={0.52}
        clearcoat={1}
        clearcoatRoughness={0.03}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

function SceneCluster({ scrollProgress, scrollDirection, scrollVelocity }) {
  const cluster = useRef(null);

  useFrame((state) => {
    if (!cluster.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    const splashProgress = 1 - scrollProgress;
    const upwardBurst = scrollDirection < 0 ? scrollVelocity * 0.18 : 0;
    cluster.current.rotation.y = THREE.MathUtils.lerp(
      cluster.current.rotation.y,
      Math.sin(time * 0.22) * 0.12 + splashProgress * 0.08 - scrollProgress * 0.06,
      0.04,
    );
    cluster.current.rotation.x = THREE.MathUtils.lerp(
      cluster.current.rotation.x,
      -0.04 - scrollProgress * 0.08 + Math.cos(time * 0.18) * 0.03,
      0.04,
    );
    cluster.current.position.y = THREE.MathUtils.lerp(
      cluster.current.position.y,
      -0.18 - scrollProgress * 0.48 + upwardBurst,
      0.06,
    );
  });

  return (
    <group ref={cluster}>
      <Bowl />

      {splashArcs.map((arc) => (
        <SplashArc
          key={`${arc.position.join('-')}-${arc.color}`}
          {...arc}
          splashProgress={1 - scrollProgress}
          scrollDirection={scrollDirection}
          scrollVelocity={scrollVelocity}
        />
      ))}

      {droplets.map((drop) => (
        <Droplet
          key={`${drop.position.join('-')}-${drop.color}`}
          {...drop}
          splashProgress={1 - scrollProgress}
          scrollDirection={scrollDirection}
          scrollVelocity={scrollVelocity}
        />
      ))}

      {fruitItems.map((fruit) => (
        <FruitShell
          key={fruit.id}
          position={fruit.position}
          bowlPosition={fruit.bowlPosition}
          rotation={fruit.rotation}
          scale={fruit.scale}
          floatSpeed={fruit.floatSpeed}
          scrollProgress={scrollProgress}
          scrollDirection={scrollDirection}
          scrollVelocity={scrollVelocity}
        >
          <FruitModel type={fruit.type} />
        </FruitShell>
      ))}
    </group>
  );
}

const Scene3D = ({ scrollProgress, scrollDirection = 0, scrollVelocity = 0 }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 1.6, 8.8]} fov={34} />

        <color attach="background" args={['#0f78d8']} />
        <fog attach="fog" args={['#0f78d8', 10, 16]} />

        <ambientLight intensity={0.8} />
        <hemisphereLight intensity={0.9} color="#f9fcff" groundColor="#3f7bd2" />
        <directionalLight
          position={[4.5, 8, 5.5]}
          intensity={2.3}
          color="#fff8f0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-3.5, 4, 3]} intensity={0.9} color="#7fe0ff" />
        <pointLight position={[3.6, 3.8, -1.8]} intensity={0.75} color="#ffc966" />

        <SceneCluster
          scrollProgress={scrollProgress}
          scrollDirection={scrollDirection}
          scrollVelocity={scrollVelocity}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.45, 0]} receiveShadow>
          <circleGeometry args={[7.5, 48]} />
          <shadowMaterial transparent opacity={0.22} />
        </mesh>

        <ContactShadows position={[0, -3.28, 0]} opacity={0.32} scale={8} blur={2.8} far={5.2} />
        <Environment preset="warehouse" />
      </Canvas>
    </div>
  );
};

export default Scene3D;
