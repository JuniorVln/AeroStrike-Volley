import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Procedural texture generator for the Volleyball
function useVolleyballTextures() {
  return useMemo(() => {
    const width = 1024;
    const height = 512;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bumpCtx = bumpCanvas.getContext('2d');

    if (ctx && bumpCtx) {
      const imgData = ctx.createImageData(width, height);
      const bumpData = bumpCtx.createImageData(width, height);
      
      const cBlue = [37, 99, 235]; // #2563EB
      const cYellow = [255, 215, 0]; // #FFD700
      const cWhite = [248, 250, 252]; // #F8FAFC
      const cSeam = [15, 23, 42]; // #0F172A

      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          // UV to spherical coordinates
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
          // Match the classic 18-panel volleyball pattern
          if (face === 0) color = panel === 1 ? cYellow : cBlue;
          else if (face === 1) color = panel === 1 ? cWhite : cYellow;
          else color = panel === 1 ? cBlue : cWhite;

          const dEdgeX = Math.abs(ax - ay) * 0.707106;
          const dEdgeY = Math.abs(ay - az) * 0.707106;
          const dEdgeZ = Math.abs(az - ax) * 0.707106;
          let dSeam = Math.min(dEdgeX, dEdgeY, dEdgeZ);

          if (face === 0) {
            dSeam = Math.min(dSeam, Math.abs(Math.abs(z) - ax * 0.3333) * 0.94868);
          } else if (face === 1) {
            dSeam = Math.min(dSeam, Math.abs(Math.abs(x) - ay * 0.3333) * 0.94868);
          } else {
            dSeam = Math.min(dSeam, Math.abs(Math.abs(y) - az * 0.3333) * 0.94868);
          }

          // Anti-aliased seam
          const seamThickness = 0.012;
          const blend = Math.max(0, Math.min(1, (dSeam - seamThickness) / 0.005));
          
          const idx = (py * width + px) * 4;
          imgData.data[idx] = cSeam[0] * (1 - blend) + color[0] * blend;
          imgData.data[idx+1] = cSeam[1] * (1 - blend) + color[1] * blend;
          imgData.data[idx+2] = cSeam[2] * (1 - blend) + color[2] * blend;
          imgData.data[idx+3] = 255;

          // Bump map: seams are dark, panels are white
          const bumpVal = blend * 255;
          bumpData.data[idx] = bumpVal;
          bumpData.data[idx+1] = bumpVal;
          bumpData.data[idx+2] = bumpVal;
          bumpData.data[idx+3] = 255;
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      bumpCtx.putImageData(bumpData, 0, 0);

      // Add micro-texture (dimples) to bump map
      bumpCtx.globalCompositeOperation = 'multiply';
      bumpCtx.fillStyle = 'rgba(200, 200, 200, 1)';
      for (let i = 0; i < 150000; i++) {
        const px = Math.random() * width;
        const py = Math.random() * height;
        const r = Math.random() * 0.5 + 0.1;
        bumpCtx.beginPath();
        bumpCtx.arc(px, py, r, 0, Math.PI * 2);
        bumpCtx.fill();
      }
      bumpCtx.globalCompositeOperation = 'source-over';
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

    return { colorMap, bumpMap };
  }, []);
}

export default function Scene({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const ballRef = useRef<THREE.Group>(null);
  const innerBallRef = useRef<THREE.Group>(null);
  const textures = useVolleyballTextures();

  useFrame((state, delta) => {
    if (innerBallRef.current) {
      innerBallRef.current.rotation.y += delta * 0.2;
      innerBallRef.current.rotation.x += delta * 0.05;
    }
  });

  useGSAP(() => {
    if (!ballRef.current || !containerRef.current) return;

    // Initial setup (Centered for Hero)
    gsap.set(ballRef.current.position, { x: 0, y: 0, z: 0 });
    gsap.set(ballRef.current.rotation, { x: 0, y: 0, z: 0 });
    gsap.set(ballRef.current.scale, { x: 0.85, y: 0.85, z: 0.85 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smoother scrubbing
      }
    });

    // Section 1 to 2 (Hero -> Texture)
    tl.to(ballRef.current.position, {
      x: -2.5,
      z: 0, 
      ease: "power2.inOut"
    }, 0)
    .to(ballRef.current.scale, {
      x: 1.7,
      y: 1.7,
      z: 1.7,
      ease: "power2.inOut"
    }, 0)
    .to(ballRef.current.rotation, {
      x: 0.5,
      y: Math.PI * 1.5, // Rotate to show detail
      ease: "power2.inOut"
    }, 0);

    // Section 2 to 3 (Texture -> Aero)
    tl.to(ballRef.current.position, {
      x: 2.5,
      z: 0, 
      ease: "power2.inOut"
    }, 1)
    .to(ballRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      ease: "power2.inOut"
    }, 1)
    .to(ballRef.current.rotation, {
      x: -0.5,
      y: Math.PI * 3.5, // Fast spin
      z: -0.5,
      ease: "power2.inOut"
    }, 1);

    // Section 3 to 4 (Aero -> CTA)
    tl.to(ballRef.current.position, {
      x: 0,
      y: 0.5,
      z: 0, 
      ease: "power2.inOut"
    }, 2)
    .to(ballRef.current.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      ease: "power2.inOut"
    }, 2)
    .to(ballRef.current.rotation, {
      x: -0.2,
      y: Math.PI * 4.2, // Final heroic pose
      z: 0.1,
      ease: "power2.inOut"
    }, 2);

  }, { dependencies: [containerRef], scope: containerRef });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={2} color="#00E5FF" />
      <directionalLight position={[0, 10, -10]} intensity={1} color="#EAB308" />

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <group ref={ballRef}>
          <group ref={innerBallRef}>
            {/* Realistic Volleyball Sphere - Reduced size to fit the layout better */}
            <Sphere args={[0.95, 128, 128]}>
              <meshPhysicalMaterial
                map={textures.colorMap}
                bumpMap={textures.bumpMap}
                bumpScale={0.02}
                roughness={0.65}
                metalness={0.1}
                clearcoat={0.3}
                clearcoatRoughness={0.4}
              />
            </Sphere>
          </group>
        </group>
      </Float>
    </>
  );
}
