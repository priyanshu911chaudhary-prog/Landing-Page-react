import React, { useRef, useMemo, useEffect, useLayoutEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { dnaState } from '@/store/dnaState';
import { useReducedMotionPreference } from '@/hooks/useReducedMotion';

/* --- Generate a helix curve path --- */
class HelixCurve extends THREE.Curve {
    constructor(radius, height, twists, offset = 0) {
        super();
        this.radius = radius;
        this.height = height;
        this.twists = twists;
        this.offset = offset;
    }
    getPoint(t) {
        const angle = t * Math.PI * 2 * this.twists + this.offset;
        const x = Math.cos(angle) * this.radius;
        const y = (t - 0.5) * this.height;
        const z = Math.sin(angle) * this.radius;
        return new THREE.Vector3(x, y, z);
    }
}

/* --- Premium Metallic DNA Strand --- */
const ThickStrand = ({ curve, color = "#94a3b8", emissiveColor = "#334155" }) => {
    const tubeRadius = 0.18;
    
    const geometry = useMemo(() => {
        return new THREE.TubeGeometry(curve, 400, tubeRadius, 48, false);
    }, [curve, tubeRadius]);

    const startPoint = useMemo(() => curve.getPoint(0), [curve]);
    const endPoint = useMemo(() => curve.getPoint(1), [curve]);
    const capGeometry = useMemo(() => new THREE.SphereGeometry(tubeRadius, 40, 40), [tubeRadius]);

    const material = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: color,
        emissive: emissiveColor,
        emissiveIntensity: 0.06,
        metalness: 0.72,
        roughness: 0.18,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        side: THREE.FrontSide
    }), [color, emissiveColor]);

    useEffect(() => {
        return () => {
            geometry.dispose();
            capGeometry.dispose();
            material.dispose();
        };
    }, [capGeometry, geometry, material]);

    return (
        <group>
            <mesh geometry={geometry} material={material} />
            <mesh position={startPoint} geometry={capGeometry} material={material} />
            <mesh position={endPoint} geometry={capGeometry} material={material} />
        </group>
    );
};

/* --- Metallic Connecting Rods (Base Pairs) --- */
const ThickConnectors = ({ curve1, curve2, count, radius }) => {
    const meshRef = useRef(null);
    
    const geometry = useMemo(() => new THREE.CylinderGeometry(radius, radius, 1, 32), [radius]);
    
    const material = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#64748b",
        emissive: "#1e293b",
        emissiveIntensity: 0.03,
        metalness: 0.6,
        roughness: 0.25,
        clearcoat: 0.4
    }), []);

    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    useLayoutEffect(() => {
        if (!meshRef.current) return;
        const dummy = new THREE.Object3D();
        const midpoint = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const upAxis = new THREE.Vector3(0, 1, 0);
        
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const p1 = curve1.getPoint(t);
            const p2 = curve2.getPoint(t);
            
            const distance = p1.distanceTo(p2);
            midpoint.copy(p1).add(p2).multiplyScalar(0.5);
            
            dummy.position.copy(midpoint);
            
            direction.subVectors(p2, p1).normalize();
            dummy.quaternion.setFromUnitVectors(upAxis, direction);
            
            // Push connectors slightly inside tubes by reducing scale height
            dummy.scale.set(1, distance - 0.2, 1);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [curve1, curve2, count]);

    return (
        <instancedMesh ref={meshRef} args={[geometry, material, count]} />
    );
};

/* --- Main Metallic DNA Scene --- */
const ThickDNA = ({ active = true, reducedMotion = false, isMobile = false }) => {
    const groupRef = useRef(null);
    const strandARef = useRef(null);
    const strandBRef = useRef(null);
    const connectorGroupRef = useRef(null);
    const mouseTargetRef = useRef({ x: 0, y: 0 });
    const mouseSmoothRef = useRef({ x: 0, y: 0 });
    const mobileFrameAccumulator = useRef(0);
    useEffect(() => {
        if (reducedMotion) return undefined;

        const handleMouseMove = (e) => {
            mouseTargetRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [reducedMotion]);

    useFrame((state, delta) => {
        if (!groupRef.current || !active) return;

        if (reducedMotion) {
            groupRef.current.position.set(dnaState.x, dnaState.y, dnaState.z);
            groupRef.current.rotation.set(dnaState.rotationX, dnaState.rotationY, dnaState.rotationZ);
            groupRef.current.scale.setScalar(dnaState.scale * 1.1);
            return;
        }

        if (isMobile) {
            mobileFrameAccumulator.current += delta;
            if (mobileFrameAccumulator.current < 1 / 30) return;
            mobileFrameAccumulator.current = 0;
        }

        mouseSmoothRef.current.x += (mouseTargetRef.current.x - mouseSmoothRef.current.x) * 0.06;
        mouseSmoothRef.current.y += (mouseTargetRef.current.y - mouseSmoothRef.current.y) * 0.06;

        const time = state.clock.getElapsedTime();
        const flowIntensity = 1;
        const flowWaveX = Math.sin(time * 1.6) * 0.12 * flowIntensity;
        const flowWaveY = Math.sin(time * 1.1 + 1.4) * 0.1 * flowIntensity;
        const flowWaveZ = Math.cos(time * 1.5) * 0.08 * flowIntensity;
        
        groupRef.current.position.set(
            dnaState.x + flowWaveX,
            dnaState.y + flowWaveY,
            dnaState.z + flowWaveZ,
        );
        
        const targetRotX = dnaState.rotationX + mouseSmoothRef.current.y * 0.05;
        const targetRotZ = dnaState.rotationZ + mouseSmoothRef.current.x * -0.03;
        
        groupRef.current.rotation.x = targetRotX + Math.sin(time * 1.2) * 0.07 * flowIntensity;
        groupRef.current.rotation.y = dnaState.rotationY + Math.cos(time * 1.5) * 0.06 * flowIntensity;
        groupRef.current.rotation.z = targetRotZ + Math.sin(time * 1.4 + 0.7) * 0.05 * flowIntensity;
        
        const currentScale = dnaState.scale * 1.1;
        const flowScaleX = currentScale * (1 + Math.sin(time * 1.8) * 0.025 * flowIntensity);
        const flowScaleY = currentScale * (1 + Math.sin(time * 1.4 + 1.2) * 0.018 * flowIntensity);
        const flowScaleZ = currentScale * (1 + Math.cos(time * 1.6) * 0.022 * flowIntensity);
        groupRef.current.scale.set(flowScaleX, flowScaleY, flowScaleZ);

        if (strandARef.current) {
            strandARef.current.position.x = Math.sin(time * 2.3) * 0.08;
            strandARef.current.position.z = Math.cos(time * 2.6) * 0.05;
            strandARef.current.rotation.y = Math.sin(time * 1.8) * 0.03;
        }

        if (strandBRef.current) {
            strandBRef.current.position.x = Math.sin(time * 2.3 + Math.PI) * 0.08;
            strandBRef.current.position.z = Math.cos(time * 2.6 + Math.PI) * 0.05;
            strandBRef.current.rotation.y = Math.sin(time * 1.8 + Math.PI) * 0.03;
        }

        if (connectorGroupRef.current) {
            const pulse = 1 + Math.sin(time * 2.9) * 0.02;
            connectorGroupRef.current.scale.set(pulse, 1 + Math.cos(time * 2.5) * 0.012, pulse);
        }
    });

    const helixRadius = 1.4; 
    const helixHeight = 8.2; 
    const twists = 2.5;      
    const connectorRadius = 0.05; 
    const connectorCount = 34;    

    const curve1 = useMemo(() => new HelixCurve(helixRadius, helixHeight, twists, 0), [helixRadius, helixHeight, twists]);
    const curve2 = useMemo(() => new HelixCurve(helixRadius, helixHeight, twists, Math.PI), [helixRadius, helixHeight, twists]);

    return (
        <group ref={groupRef}>
            <group ref={strandARef}>
                <ThickStrand curve={curve1} color="#94a3b8" emissiveColor="#334155" />
            </group>
            <group ref={strandBRef}>
                <ThickStrand curve={curve2} color="#cbd5e1" emissiveColor="#475569" />
            </group>
            <group ref={connectorGroupRef}>
                <ThickConnectors curve1={curve1} curve2={curve2} count={connectorCount} radius={connectorRadius} />
            </group>
        </group>
    );
};

export default function AITrustScanner() {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const reducedMotion = useReducedMotionPreference();

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const media = window.matchMedia('(max-width: 768px)');
        const handleViewportChange = () => setIsMobile(media.matches);
        handleViewportChange();

        if (media.addEventListener) {
            media.addEventListener('change', handleViewportChange);
            return () => media.removeEventListener('change', handleViewportChange);
        }

        media.addListener(handleViewportChange);
        return () => media.removeListener(handleViewportChange);
    }, []);

    useEffect(() => {
        const node = containerRef.current;
        if (!node || typeof IntersectionObserver === 'undefined') return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.08 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const sceneActive = isVisible;
    const shouldRenderPostFx = sceneActive && !reducedMotion;
    const dprRange = isMobile || reducedMotion ? [1, 1.25] : [1, 2];

    return (
        <div ref={containerRef} className="w-full h-full pointer-events-none" aria-hidden="true">
            <Canvas
                frameloop={!sceneActive ? 'never' : reducedMotion ? 'demand' : 'always'}
                dpr={dprRange}
                camera={{ position: [0, 0, 8.4], fov: 48 }}
                gl={{ antialias: !isMobile, alpha: true, powerPreference: reducedMotion ? 'default' : 'high-performance' }}
                performance={{ min: 0.6 }}
            >
                {/* Clean neutral lighting for metallic reflections */}
                <ambientLight intensity={0.35} color="#f1f5f9" />
                <directionalLight position={[5, 8, 5]} intensity={1.6} color="#f8fafc" />
                <directionalLight position={[-3, -5, 3]} intensity={0.6} color="#e2e8f0" />

                <Float
                    speed={reducedMotion ? 0 : 0.8}
                    rotationIntensity={reducedMotion ? 0 : 0.05}
                    floatIntensity={reducedMotion ? 0 : 0.08}
                >
                    <ThickDNA active={sceneActive} reducedMotion={reducedMotion} isMobile={isMobile} />
                </Float>

                {/* Subtle bloom — just enough for a refined metallic sheen */}
                {shouldRenderPostFx ? (
                    <EffectComposer disableNormalPass>
                        <Bloom
                            luminanceThreshold={0.85}
                            mipmapBlur
                            intensity={0.2}
                            radius={0.35}
                        />
                    </EffectComposer>
                ) : null}
            </Canvas>
        </div>
    );
}
