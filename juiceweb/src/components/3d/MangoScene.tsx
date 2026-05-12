"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Stars, MeshTransmissionMaterial, Text, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function Bottle({ color = "#FFD700", liquidColor = "#FF6B00" }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const liquidRef = useRef<THREE.Mesh>(null!)

  const bottleShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0.3, -2)
    shape.quadraticCurveTo(0.3, -1.6, 0.25, -1.4)
    shape.quadraticCurveTo(0.35, -1, 0.35, -0.5)
    shape.quadraticCurveTo(0.35, 0.5, 0.25, 1)
    shape.quadraticCurveTo(0.2, 1.3, 0.15, 1.5)
    shape.quadraticCurveTo(0.1, 1.7, 0.08, 2)
    shape.quadraticCurveTo(0.12, 2.2, 0.2, 2.3)
    shape.quadraticCurveTo(0.15, 2.4, 0, 2.4)
    shape.quadraticCurveTo(-0.15, 2.4, -0.2, 2.3)
    shape.quadraticCurveTo(-0.12, 2.2, -0.08, 2)
    shape.quadraticCurveTo(-0.1, 1.7, -0.15, 1.5)
    shape.quadraticCurveTo(-0.2, 1.3, -0.25, 1)
    shape.quadraticCurveTo(-0.35, 0.5, -0.35, -0.5)
    shape.quadraticCurveTo(-0.35, -1, -0.25, -1.4)
    shape.quadraticCurveTo(-0.3, -1.6, -0.3, -2)
    shape.closePath()

    const settings: THREE.ExtrudeGeometryOptions = {
      steps: 32,
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02,
      bevelSegments: 8,
    }

    return new THREE.ExtrudeGeometry(shape, settings)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.3
    if (liquidRef.current) {
      liquidRef.current.position.y = Math.sin(t * 0.5) * 0.05
    }
  })

  return (
    <group ref={meshRef as any}>
      {/* Bottle body */}
      <mesh geometry={bottleShape} position={[0, 0, 0]}>
        <MeshTransmissionMaterial
          backside
          thickness={0.3}
          roughness={0.1}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.06}
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Liquid inside */}
      <mesh position={[0, -0.2, 0]} scale={[0.7, 0.6, 0.7]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={liquidColor}
          emissive={liquidColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.3, 16]} />
        <meshPhysicalMaterial
          color="#222"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glow ring */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.7, 64]} />
        <meshBasicMaterial
          color={liquidColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Particles orbiting */}
      {Array.from({ length: 12 }).map((_, i) => (
        <OrbitingParticle key={i} index={i} color={liquidColor} />
      ))}
    </group>
  )
}

function OrbitingParticle({ index, color }: { index: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  const angle = (index / 12) * Math.PI * 2
  const radius = 0.8 + Math.random() * 0.3

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.5
    ref.current.position.x = Math.cos(angle + t) * radius
    ref.current.position.z = Math.sin(angle + t) * radius
    ref.current.position.y = Math.sin(t * 2 + index) * 0.3
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function FloatingMango() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshPhysicalMaterial
          color="#FFA500"
          emissive="#FF6B00"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Leaf */}
      <mesh position={[0, 0.45, 0]} rotation={[0.3, 0, 0.5]}>
        <planeGeometry args={[0.15, 0.3]} />
        <meshBasicMaterial color="#22c55e" side={THREE.DoubleSide} />
      </mesh>
    </Float>
  )
}

function Particles() {
  const count = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#FFD700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function Scene({ bottleColor, liquidColor }: { bottleColor: string; liquidColor: string }) {
  const controlsRef = useRef<any>(null!)

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <pointLight position={[0, 3, 2]} intensity={1} color={liquidColor} />

      <Stars radius={30} depth={50} count={500} factor={4} saturation={0} fade speed={1} />

      <group position={[0, 0, 0]}>
        <Bottle color={bottleColor} liquidColor={liquidColor} />
        <group position={[1.2, -0.5, 0]}>
          <FloatingMango />
        </group>
      </group>

      <Particles />

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

export default function MangoScene({
  bottleColor = "#FFD700",
  liquidColor = "#FF6B00",
}: {
  bottleColor?: string
  liquidColor?: string
}) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene bottleColor={bottleColor} liquidColor={liquidColor} />
      </Canvas>
    </div>
  )
}
