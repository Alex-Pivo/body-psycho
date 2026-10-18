'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Mannequin } from './Mannequin';
import { CameraRig } from './CameraRig';
import { Particles } from './Particles';

export function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 35, near: 0.05, far: 50, position: [0, 1.58, 1.7] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#04050a', 8, 22]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 3]} intensity={0.8} />

      <Mannequin />
      <CameraRig />

      {/* Круглые светящиеся точки вдоль всего пути, без квадратного фона */}
      <Particles />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.25}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}