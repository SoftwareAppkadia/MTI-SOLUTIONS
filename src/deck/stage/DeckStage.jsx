import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleField, DataStreaks, damp } from './fx.jsx';
import LogoStation from './LogoStation.jsx';
import GlobeStation, { globePose } from './GlobeStation.jsx';
import BuildStation, { buildPose } from './BuildStation.jsx';
import FlowStation, { flowPose } from './FlowStation.jsx';
import OrchestratorStation, { orchPose } from './OrchestratorStation.jsx';
import CampusStation, { campusPose } from './CampusStation.jsx';

/**
 * Lienzo 3D único del recorrido.
 *
 * Todas las escenas propias viven en el mismo espacio, en «estaciones»
 * separadas, y la cámara viaja de una a otra atravesando el campo de
 * partículas: eso es lo que hace que los cambios de capítulo sean un
 * movimiento continuo y no un corte.
 *
 * Un solo lienzo y un solo contexto WebGL durante todo el recorrido: no se
 * crean ni destruyen contextos al cambiar de capítulo (la causa de fondo de
 * los problemas del globo anterior). Cuando la escena activa es la ciudad o
 * una fotografía, este lienzo se funde y deja de dibujar.
 */

function logoPose(step) {
  // en el paso 1 la cámara atraviesa el logo mientras estalla
  return step === 0 ? { position: [0, 0.3, 17], target: [0, 0.3, 0] } : { position: [0, 0.6, -6], target: [0, 0, -60] };
}

const VOID_POSE = { position: [6, 4, -40], target: [0, 0, -120] };

function poseFor(station, step, sel, aspect, orch, campus) {
  switch (station) {
    case 'logo':
      return logoPose(step);
    case 'globe':
      return globePose(step, sel.place, aspect);
    case 'build':
      return buildPose(step, aspect);
    case 'flow':
      return flowPose(step, aspect);
    case 'orch':
      return orchPose(orch?.mode, step, aspect);
    case 'campus':
      return campusPose(campus?.mode, aspect);
    case 'void':
      return step === 1 ? logoPose(1) : VOID_POSE;
    default:
      return null;
  }
}

/** La cámara: persigue la pose del paso, con paralaje del puntero. */
function Rig({ station, chapterId, step, sel, paused, pointer, orch, campus }) {
  const { camera, size } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.3, 0));
  const goalP = useMemo(() => new THREE.Vector3(), []);
  const goalT = useMemo(() => new THREE.Vector3(), []);
  const first = useRef(true);
  const t = useRef(0);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    if (!paused) t.current += dt;
    const aspect = size.width / Math.max(1, size.height);
    const effective = station === 'void' && chapterId === 'opening' ? 'void' : station;
    const pose = poseFor(effective, step, sel, aspect, orch, campus);
    if (!pose) return;
    goalP.set(...pose.position);
    goalT.set(...pose.target);

    // respiración de cámara y paralaje: la escena reacciona a quien presenta
    const dist = goalP.distanceTo(goalT);
    const amp = dist * 0.018;
    goalP.x += Math.sin(t.current * 0.21) * amp + pointer.current.x * amp * 1.6;
    goalP.y += Math.cos(t.current * 0.17) * amp * 0.6 - pointer.current.y * amp;

    if (first.current) {
      camera.position.copy(goalP);
      target.current.copy(goalT);
      first.current = false;
    }
    // viaje largo entre estaciones más rápido; ajustes finos más suaves
    const far = camera.position.distanceTo(goalP) > 60;
    const k = paused ? 12 : far ? 1.9 : 2.1;
    camera.position.x = damp(camera.position.x, goalP.x, k, dt);
    camera.position.y = damp(camera.position.y, goalP.y, k, dt);
    camera.position.z = damp(camera.position.z, goalP.z, k, dt);
    target.current.x = damp(target.current.x, goalT.x, k, dt);
    target.current.y = damp(target.current.y, goalT.y, k, dt);
    target.current.z = damp(target.current.z, goalT.z, k, dt);
    camera.lookAt(target.current);
  });
  return null;
}

/** Monta cada estación la primera vez que hace falta (o la siguiente) y la conserva. */
function useMounted(stations) {
  const [mounted, setMounted] = useState(() => new Set(stations.filter(Boolean)));
  useEffect(() => {
    const missing = stations.filter((s) => s && !mounted.has(s));
    if (missing.length) setMounted((m) => new Set([...m, ...missing]));
  }, [stations, mounted]);
  return mounted;
}

export default function DeckStage({
  station,
  nextStation,
  chapterId,
  step,
  sel,
  paused,
  lowPower,
  globe,
  build,
  flow,
  orch,
  campus,
  onContextLost,
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const [loop, setLoop] = useState(station ? 'always' : 'never');
  const mounted = useMounted([station, nextStation]);

  // cuando la escena activa no es propia, el lienzo se funde y luego se para
  useEffect(() => {
    if (station) {
      setLoop('always');
      return undefined;
    }
    const id = setTimeout(() => setLoop('never'), 1100);
    return () => clearTimeout(id);
  }, [station]);

  useEffect(() => {
    let raf = 0;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const logoPhase = chapterId === 'opening' ? (step === 0 ? 'assemble' : step === 1 ? 'explode' : 'hidden') : 'hidden';
  const particleOpacity = station === 'globe' ? 0.55 : station === 'logo' ? 0.9 : station === 'campus' ? 0.35 : 0.75;

  return (
    <div className={`deck-stage${station ? ' is-on' : ''}`} aria-hidden="true">
      <Canvas
        frameloop={loop}
        dpr={lowPower ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0.3, 17], fov: 38, near: 0.1, far: 900 }}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            onContextLost?.();
          });
        }}
      >
        <Rig station={station} chapterId={chapterId} step={step} sel={sel} paused={paused} pointer={pointer} orch={orch} campus={campus} />
        <ParticleField count={lowPower ? 1200 : 2600} paused={paused} opacity={particleOpacity} />
        <DataStreaks count={lowPower ? 40 : 90} paused={paused} opacity={station === 'globe' ? 0.25 : 0.5} />

        {(mounted.has('logo') || chapterId === 'opening') && <LogoStation phase={logoPhase} paused={paused} count={lowPower ? 2600 : 4800} />}
        <Suspense fallback={null}>
          {mounted.has('globe') && <GlobeStation active={station === 'globe'} step={step} paused={paused} lowPower={lowPower} {...globe} />}
          {mounted.has('build') && <BuildStation active={station === 'build'} step={step} paused={paused} {...build} />}
          {mounted.has('flow') && <FlowStation active={station === 'flow'} step={step} paused={paused} {...flow} />}
          {mounted.has('orch') && <OrchestratorStation active={station === 'orch'} step={step} paused={paused} {...orch} />}
          {mounted.has('campus') && campus?.url && <CampusStation active={station === 'campus'} paused={paused} {...campus} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
