"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

function Particles({ count = 60, color = "#FFD700", speed = 0.3 }) {
  const ref = useRef<THREE.Points>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.5
      pos[i * 3 + 2] = Math.cos(phi) * r
      vel[i * 3] = (Math.random() - 0.5) * 0.01
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }
    return [pos, vel]
  }, [count])

  const handlePointer = (e: { clientX: number; clientY: number }) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(t + i) * 0.001 + velocities[i * 3]
      pos[i * 3 + 1] += Math.cos(t * 0.7 + i * 0.5) * 0.001 + velocities[i * 3 + 1]
      pos[i * 3 + 2] += Math.sin(t * 0.5 + i * 0.3) * 0.001 + velocities[i * 3 + 2]
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points
      ref={ref}
      onPointerMove={handlePointer}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={color} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function FloatingShape({ position, color, type = "sphere" }: { position: [number, number, number]; color: string; type?: string }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.5
    ref.current.rotation.x = t * 0.2
    ref.current.rotation.z = t * 0.15
  })

  return (
    <mesh ref={ref} position={position}>
      {type === "ring" ? (
        <ringGeometry args={[0.2, 0.3, 16]} />
      ) : type === "box" ? (
        <boxGeometry args={[0.15, 0.15, 0.15]} />
      ) : (
        <icosahedronGeometry args={[0.12, 0]} />
      )}
      <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
    </mesh>
  )
}

function Scene({ color = "#FFD700", particleCount = 60 }: { color?: string; particleCount?: number }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <Particles count={particleCount} color={color} />
      <FloatingShape position={[-2, 1, -1]} color={color} type="sphere" />
      <FloatingShape position={[2.5, -0.5, -1.5]} color="#FF6B00" type="ring" />
      <FloatingShape position={[-1.5, -1.5, -2]} color="#FFD700" type="box" />
      <FloatingShape position={[1.8, 1.8, -2.5]} color="#FF6B00" type="sphere" />
    </>
  )
}

export default function ThreeBackground({
  color = "#FFD700",
  particleCount = 60,
  className = "",
}: {
  color?: string
  particleCount?: number
  className?: string
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <Scene color={color} particleCount={particleCount} />
      </Canvas>
    </div>
  )
}
