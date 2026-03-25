import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Simple hash for pseudo-random noise
function hash(x: number, y: number) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

// Procedural texture generator for the Volleyball
function useVolleyballTextures() {
  return useMemo(() => {
    const width = 2048;
    const height = 1024;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bumpCtx = bumpCanvas.getContext('2d');

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = width;
    roughCanvas.height = height;
    const roughCtx = roughCanvas.getContext('2d');

    if (ctx && bumpCtx && roughCtx) {
      const imgData = ctx.createImageData(width, height);
      const bumpData = bumpCtx.createImageData(width, height);
      const roughData = roughCtx.createImageData(width, height);

      const cBlue = [37, 99, 235];
      const cYellow = [255, 215, 0];
      const cWhite = [248, 250, 252];
      const cSeam = [15, 23, 42];

      // Pebble grid parameters
      const pebbleSpacing = 6;
      const pebbleRadius = 2.2;

      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const u = px / width;
          const v = py / height;

          const theta = u * 2 * Math.PI;
          const phi = (v - 0.5) * Math.PI;

          const x = Math.cos(phi) * Math.cos(theta);
          const y = Math.sin(phi);
          const z = Math.cos(phi) * Math.sin(theta);

          const ax = Math.abs(x);
          const ay = Math.abs(y);
          const az = Math.abs(z);

          let face = 0;
          let max = ax;
          if (ay > max) { max = ay; face = 1; }
          if (az > max) { max = az; face = 2; }

          let splitVal = 0;
          if (face === 0) splitVal = z / ax;
          else if (face === 1) splitVal = x / ay;
          else splitVal = y / az;

          let panel = 1;
          if (splitVal < -0.3333) panel = 0;
          else if (splitVal > 0.3333) panel = 2;

          let color = cWhite;
          if (face === 0) color = panel === 1 ? cYellow : cBlue;
          else if (face === 1) color = panel === 1 ? cWhite : cYellow;
          else color = panel === 1 ? cBlue : cWhite;

          const dEdgeX = Math.abs(ax - ay) * 0.707106;
          const dEdgeY = Math.abs(ay - az) * 0.707106;
          const dEdgeZ = Math.abs(az - ax) * 0.707106;
          let dSeam = Math.min(dEdgeX, dEdgeY, dEdgeZ);

          if (face === 0) dSeam = Math.min(dSeam, Math.abs(Math.abs(z) - ax * 0.3333) * 0.94868);
          else if (face === 1) dSeam = Math.min(dSeam, Math.abs(Math.abs(x) - ay * 0.3333) * 0.94868);
          else dSeam = Math.min(dSeam, Math.abs(Math.abs(y) - az * 0.3333) * 0.94868);

          const seamThickness = 0.012;
          const blend = Math.max(0, Math.min(1, (dSeam - seamThickness) / 0.005));

          // --- Pebble / grain pattern ---
          // Hex-offset grid for organic pebble placement
          const row = Math.floor(py / pebbleSpacing);
          const offsetX = (row % 2) * (pebbleSpacing * 0.5);
          const cellX = Math.floor((px + offsetX) / pebbleSpacing);
          const cellY = row;
          // Jitter the pebble center for organic look
          const jx = hash(cellX, cellY) * pebbleSpacing * 0.4;
          const jy = hash(cellX + 9999, cellY + 7777) * pebbleSpacing * 0.4;
          const cx = cellX * pebbleSpacing - offsetX + pebbleSpacing * 0.5 + jx;
          const cy = cellY * pebbleSpacing + pebbleSpacing * 0.5 + jy;
          const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);

          // Smooth pebble bump: 1 at center, 0 at edge
          const pebbleBump = Math.max(0, 1.0 - (dist / pebbleRadius));
          const pebbleShape = pebbleBump * pebbleBump * (3 - 2 * pebbleBump); // smoothstep

          // Fine grain noise per pixel
          const grain = (hash(px, py) - 0.5) * 0.12;

          // --- Color map: base color + subtle grain variation ---
          const grainColor = grain * 30;
          const idx = (py * width + px) * 4;
          imgData.data[idx]   = Math.max(0, Math.min(255, (cSeam[0] * (1 - blend) + color[0] * blend) + grainColor));
          imgData.data[idx+1] = Math.max(0, Math.min(255, (cSeam[1] * (1 - blend) + color[1] * blend) + grainColor));
          imgData.data[idx+2] = Math.max(0, Math.min(255, (cSeam[2] * (1 - blend) + color[2] * blend) + grainColor));
          imgData.data[idx+3] = 255;

          // --- Bump map: seam depth + pebble bumps + fine noise ---
          const seamBump = blend;
          const pebbleContrib = pebbleShape * 0.45;
          const noiseFine = grain * 0.3;
          const bumpVal = Math.max(0, Math.min(1, seamBump * (0.5 + pebbleContrib + noiseFine)));
          bumpData.data[idx]   = bumpVal * 255;
          bumpData.data[idx+1] = bumpVal * 255;
          bumpData.data[idx+2] = bumpVal * 255;
          bumpData.data[idx+3] = 255;

          // --- Roughness map: pebble peaks are slightly smoother, valleys rougher ---
          const roughVal = 0.72 - pebbleShape * 0.15 + (hash(px + 3333, py + 5555) - 0.5) * 0.08;
          roughData.data[idx]   = Math.max(0, Math.min(255, roughVal * 255));
          roughData.data[idx+1] = roughData.data[idx];
          roughData.data[idx+2] = roughData.data[idx];
          roughData.data[idx+3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      bumpCtx.putImageData(bumpData, 0, 0);
      roughCtx.putImageData(roughData, 0, 0);
    }

    const colorMap = new THREE.CanvasTexture(canvas);
    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.anisotropy = 16;
    colorMap.colorSpace = THREE.SRGBColorSpace;

    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.anisotropy = 16;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.anisotropy = 16;

    return { colorMap, bumpMap, roughnessMap };
  }, []);
}

export default function Scene({
  containerRef,
  section5Ref,
  section6Ref,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  section5Ref: React.RefObject<HTMLElement | null>;
  section6Ref: React.RefObject<HTMLElement | null>;
}) {
  const floatGroupRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Group>(null);
  const innerBallRef = useRef<THREE.Group>(null);
  const textures = useVolleyballTextures();
  const rotSpeedObj = useRef({ value: 0.2 });
  const floatStateRef = useRef({ enabled: true, time: 0 });
  const freezeStateRef = useRef({
    active: false,
    floatPosition: new THREE.Vector3(),
    ballPosition: new THREE.Vector3(),
    ballRotation: new THREE.Euler(),
    ballScale: new THREE.Vector3(1, 1, 1),
  });

  useFrame((_state, delta) => {
    if (innerBallRef.current) {
      innerBallRef.current.rotation.y += delta * rotSpeedObj.current.value;
      innerBallRef.current.rotation.x += delta * 0.05;
    }

    if (floatGroupRef.current) {
      const floatState = floatStateRef.current;

      if (floatState.enabled) {
        floatState.time += delta;

        const targetX = Math.sin(floatState.time * 0.8) * 0.03;
        const targetY = Math.sin(floatState.time * 1.6) * 0.08;

        floatGroupRef.current.position.x = THREE.MathUtils.damp(
          floatGroupRef.current.position.x,
          targetX,
          3.5,
          delta
        );
        floatGroupRef.current.position.y = THREE.MathUtils.damp(
          floatGroupRef.current.position.y,
          targetY,
          3.5,
          delta
        );
      }
    }

    if (freezeStateRef.current.active) {
      if (floatGroupRef.current) {
        floatGroupRef.current.position.copy(freezeStateRef.current.floatPosition);
      }

      if (ballRef.current) {
        ballRef.current.position.copy(freezeStateRef.current.ballPosition);
        ballRef.current.rotation.copy(freezeStateRef.current.ballRotation);
        ballRef.current.scale.copy(freezeStateRef.current.ballScale);
      }
    }
  });

  useGSAP(() => {
    if (!ballRef.current || !containerRef.current) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const sideX = isMobile ? 1.45 : 2.5;
    const textureScale = isMobile ? 1.35 : 1.7;
    const aeroScale = isMobile ? 1.18 : 1.5;
    const centerScale = isMobile ? 0.82 : 0.95;
    const championY = isMobile ? -0.42 : -0.3;
    const initialScale = isMobile ? 0.72 : 0.85;

    // Initial setup (Centered for Hero)
    gsap.set(ballRef.current.position, { x: 0, y: 0, z: 0 });
    gsap.set(ballRef.current.rotation, { x: 0, y: 0, z: 0 });
    gsap.set(ballRef.current.scale, { x: initialScale, y: initialScale, z: initialScale });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smoother scrubbing
      }
    });

    // Each section handoff uses one scroll slot, so the ball stays anchored
    // to the active section instead of arriving too early.
    const sectionHold = 0.65;
    const sectionHandoff = 0.35;
    const textureSectionHold = 0.22;
    const textureSectionHandoff = 0.78;
    const aeroSectionHold = 0.25;
    const aeroSectionHandoff = 0.75;
    const radarSectionHold = 0.92;
    const radarSectionHandoff = 0.08;
    const textureSection = 1;
    const aeroSection = 2;
    const radarSection = 3;
    const championSection = 4;
    const finalSection = 5;
    const textureHandoffStart = textureSection + textureSectionHold;
    const aeroHandoffStart = aeroSection + aeroSectionHold;
    const radarHandoffStart = radarSection + radarSectionHold;

    // Section 1 to 2 (Hero -> Texture)
    tl.to(ballRef.current.position, {
      x: sideX,
      z: 0, 
      duration: textureSection,
      ease: "power2.inOut"
    }, 0)
    .to(ballRef.current.scale, {
      x: textureScale,
      y: textureScale,
      z: textureScale,
      duration: textureSection,
      ease: "power2.inOut"
    }, 0)
    .to(ballRef.current.rotation, {
      x: 0.5,
      y: Math.PI * 1.5, // Rotate to show detail
      duration: textureSection,
      ease: "power2.inOut"
    }, 0);

    // HOLD at section 2 — keep the ball on the right until the next section is near
    tl.to(ballRef.current.position, {
      x: sideX,
      z: 0,
      duration: textureSectionHold,
      ease: "none"
    }, textureSection)
    .to(ballRef.current.scale, {
      x: textureScale,
      y: textureScale,
      z: textureScale,
      duration: textureSectionHold,
      ease: "none"
    }, textureSection)
    .to(ballRef.current.rotation, {
      x: 0.5,
      y: Math.PI * 1.5,
      duration: textureSectionHold,
      ease: "none"
    }, textureSection);

    // Section 2 to 3 (Texture -> Aero)
    tl.to(ballRef.current.position, {
      x: -sideX,
      z: 0, 
      duration: textureSectionHandoff,
      ease: "power2.inOut"
    }, textureHandoffStart)
    .to(ballRef.current.scale, {
      x: aeroScale,
      y: aeroScale,
      z: aeroScale,
      duration: textureSectionHandoff,
      ease: "power2.inOut"
    }, textureHandoffStart)
    .to(ballRef.current.rotation, {
      x: -0.5,
      y: Math.PI * 3.5, // Fast spin
      z: -0.5,
      duration: textureSectionHandoff,
      ease: "power2.inOut"
    }, textureHandoffStart);

    // HOLD at section 3 — keep the ball on the left while the user reads Aero
    tl.to(ballRef.current.position, {
      x: -sideX,
      z: 0,
      duration: aeroSectionHold,
      ease: "none"
    }, aeroSection)
    .to(ballRef.current.scale, {
      x: aeroScale,
      y: aeroScale,
      z: aeroScale,
      duration: aeroSectionHold,
      ease: "none"
    }, aeroSection)
    .to(ballRef.current.rotation, {
      x: -0.5,
      y: Math.PI * 3.5,
      z: -0.5,
      duration: aeroSectionHold,
      ease: "none"
    }, aeroSection);

    // Section 3 to 4 (Aero -> Radar — ball centers)
    tl.to(ballRef.current.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: aeroSectionHandoff,
      ease: "power2.inOut"
    }, aeroHandoffStart)
    .to(ballRef.current.scale, {
      x: centerScale,
      y: centerScale,
      z: centerScale,
      duration: aeroSectionHandoff,
      ease: "power2.inOut"
    }, aeroHandoffStart)
    .to(ballRef.current.rotation, {
      x: -0.2,
      y: Math.PI * 4.2,
      z: 0.1,
      duration: aeroSectionHandoff,
      ease: "power2.inOut"
    }, aeroHandoffStart);

    // HOLD at section 4 — ball stays anchored at center while user reads radar section
    tl.to(ballRef.current.position, {
      x: 0, y: 0, z: 0,
      duration: radarSectionHold,
      ease: "none",
    }, radarSection)
    .to(ballRef.current.scale, {
      x: centerScale, y: centerScale, z: centerScale,
      duration: radarSectionHold,
      ease: "none",
    }, radarSection)
    .to(ballRef.current.rotation, {
      x: -0.2, y: Math.PI * 4.2, z: 0.1,
      duration: radarSectionHold,
      ease: "none",
    }, radarSection);

    // Section 4 to 5 (Radar -> Champion — ball floats above podium, final position)
    tl.to(ballRef.current.position, {
      x: 0,
      y: championY,
      z: 0,
      duration: radarSectionHandoff,
      ease: "power2.inOut"
    }, radarHandoffStart)
    .to(ballRef.current.scale, {
      x: centerScale,
      y: centerScale,
      z: centerScale,
      duration: radarSectionHandoff,
      ease: "power2.inOut"
    }, radarHandoffStart)
    .to(ballRef.current.rotation, {
      x: 0,
      y: Math.PI * 6,
      z: 0,
      duration: radarSectionHandoff,
      ease: "power2.inOut"
    }, radarHandoffStart);

    // HOLD — ball stays frozen here through rest of page (final position)
    tl.to(ballRef.current.position, {
      x: 0, y: championY, z: 0,
      duration: finalSection - championSection,
      ease: "none",
    }, championSection)
    .to(ballRef.current.scale, {
      x: centerScale, y: centerScale, z: centerScale,
      duration: finalSection - championSection,
      ease: "none",
    }, championSection)
    .to(ballRef.current.rotation, {
      x: 0, y: Math.PI * 6, z: 0,
      duration: finalSection - championSection,
      ease: "none",
    }, championSection);

    // Burst spin when section 5 enters viewport
    if (section5Ref.current) {
      ScrollTrigger.create({
        trigger: section5Ref.current,
        start: "top bottom",
        onEnter: () => {
          floatStateRef.current.enabled = false;
        },
        onLeaveBack: () => {
          floatStateRef.current.enabled = true;
        },
      });

      ScrollTrigger.create({
        trigger: section5Ref.current,
        start: "top 50%",
        once: true,
        onEnter: () => {
          gsap.to(rotSpeedObj.current, {
            value: 10,
            duration: 0.35,
            ease: "power2.in",
            onComplete: () => {
              gsap.to(rotSpeedObj.current, {
                value: 0.2,
                duration: 1.4,
                ease: "power2.out",
              });
            },
          });
        },
      });
    }

    if (section6Ref.current) {
      ScrollTrigger.create({
        trigger: section6Ref.current,
        start: "top bottom",
        onEnter: () => {
          if (floatGroupRef.current && ballRef.current) {
            freezeStateRef.current.active = true;
            freezeStateRef.current.floatPosition.copy(floatGroupRef.current.position);
            freezeStateRef.current.ballPosition.copy(ballRef.current.position);
            freezeStateRef.current.ballRotation.copy(ballRef.current.rotation);
            freezeStateRef.current.ballScale.copy(ballRef.current.scale);
          }
        },
        onLeaveBack: () => {
          freezeStateRef.current.active = false;
        },
      });
    }


  }, { dependencies: [containerRef, section5Ref, section6Ref], scope: containerRef });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={2} color="#00E5FF" />
      <directionalLight position={[0, 10, -10]} intensity={1} color="#EAB308" />

      <group ref={floatGroupRef}>
        <group ref={ballRef}>
          <group ref={innerBallRef}>
            {/* Realistic Volleyball Sphere - Reduced size to fit the layout better */}
            <Sphere args={[0.95, 128, 128]}>
              <meshPhysicalMaterial
                map={textures.colorMap}
                bumpMap={textures.bumpMap}
                bumpScale={0.06}
                roughnessMap={textures.roughnessMap}
                roughness={0.75}
                metalness={0.05}
                clearcoat={0.15}
                clearcoatRoughness={0.6}
              />
            </Sphere>
          </group>
        </group>
      </group>
    </>
  );
}
