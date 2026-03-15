import React, { useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { dnaState } from '@/store/dnaState';

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
    const meshRef = useRef(null);
    const tubeRadius = 0.18;
    
    const geometry = useMemo(() => {
        return new THREE.TubeGeometry(curve, 400, tubeRadius, 48, false);
    }, [curve, tubeRadius]);

    const startPoint = useMemo(() => curve.getPoint(0), [curve]);
    const endPoint = useMemo(() => curve.getPoint(1), [curve]);

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

    return (
        <group>
            <mesh ref={meshRef} geometry={geometry} material={material} />
            <mesh position={startPoint} material={material}>
                <sphereGeometry args={[tubeRadius, 40, 40]} />
            </mesh>
            <mesh position={endPoint} material={material}>
                <sphereGeometry args={[tubeRadius, 40, 40]} />
            </mesh>
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

    useLayoutEffect(() => {
        if (!meshRef.current) return;
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const p1 = curve1.getPoint(t);
            const p2 = curve2.getPoint(t);
            
            const distance = p1.distanceTo(p2);
            const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            
            dummy.position.copy(midpoint);
            
            const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
            dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            
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
const ThickDNA = () => {
    const groupRef = useRef(null);
    const strandARef = useRef(null);
    const strandBRef = useRef(null);
    const connectorGroupRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.getElapsedTime();
        const flowWaveX = Math.sin(time * 1.6) * 0.12;
        const flowWaveY = Math.sin(time * 1.1 + 1.4) * 0.1;
        const flowWaveZ = Math.cos(time * 1.5) * 0.08;
        
        groupRef.current.position.set(
            dnaState.x + flowWaveX,
            dnaState.y + flowWaveY,
            dnaState.z + flowWaveZ,
        );
        
        const targetRotX = dnaState.rotationX + (mouseRef.current ? mouseRef.current.y * 0.05 : 0);
        const targetRotZ = dnaState.rotationZ + (mouseRef.current ? mouseRef.current.x * -0.03 : 0);
        
        groupRef.current.rotation.x = targetRotX + Math.sin(time * 1.2) * 0.07;
        groupRef.current.rotation.y = dnaState.rotationY + Math.cos(time * 1.5) * 0.06;
        groupRef.current.rotation.z = targetRotZ + Math.sin(time * 1.4 + 0.7) * 0.05;
        
        const currentScale = dnaState.scale * 1.1;
        const flowScaleX = currentScale * (1 + Math.sin(time * 1.8) * 0.025);
        const flowScaleY = currentScale * (1 + Math.sin(time * 1.4 + 1.2) * 0.018);
        const flowScaleZ = currentScale * (1 + Math.cos(time * 1.6) * 0.022);
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
    return (
        <div className="w-full h-full pointer-events-none" aria-hidden="true">
            <Canvas camera={{ position: [0, 0, 8.4], fov: 48 }} gl={{ antialias: true, alpha: true }}>
                {/* Clean neutral lighting for metallic reflections */}
                <ambientLight intensity={0.35} color="#f1f5f9" />
                <directionalLight position={[5, 8, 5]} intensity={1.6} color="#f8fafc" />
                <directionalLight position={[-3, -5, 3]} intensity={0.6} color="#e2e8f0" />

                <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.08}>
                    <ThickDNA />
                </Float>

                {/* Subtle bloom — just enough for a refined metallic sheen */}
                <EffectComposer disableNormalPass>
                    <Bloom
                        luminanceThreshold={0.85}
                        mipmapBlur
                        intensity={0.2}
                        radius={0.35}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
