"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

function ScrollRing({ color = "#FF6B00" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)
  const outerRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.15
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.3
    }
    if (innerRef.current) innerRef.current.rotation.x = t * 0.2
    if (outerRef.current) outerRef.current.rotation.x = -t * 0.15
  })

  return (
    <group ref={groupRef}>
      <mesh ref={innerRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={outerRef} rotation={[Math.PI / 3, 0, 0]} position={[0, 0.3, 0]}>
        <ringGeometry args={[0.8, 0.9, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function DotGrid({ count = 40 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useRef(new Float32Array(count * 3))

  useEffect(() => {
    const pos = positions.current
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2
    }
  }, [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.0005
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#FFD700" transparent opacity={0.25} sizeAttenuation />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <ScrollRing color="#FF6B00" />
      <ScrollRing color="#FFD700" />
      <DotGrid count={40} />
    </>
  )
}

export default function Scroll3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  )
}
