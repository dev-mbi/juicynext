"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Stars, OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { createMangoGeometryLite } from "@/lib/geometries"

function GlowRing({ color = "#FF6B00", radius = 1.2, speed = 0.5 }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.sin(t * speed * 0.3) * 0.1
    ref.current.rotation.z = Math.cos(t * speed * 0.2) * 0.1
  })

  return (
    <mesh ref={ref} rotation={[Math.PI / 2.2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  )
}

function PulsingGlow({ color = "#FFD700" }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const pulse = 0.08 + Math.sin(t * 1.5) * 0.04
    ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.15)
    if (ref.current.material) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity = pulse
    }
  })

  return (
    <mesh ref={ref} position={[0, 0.3, 0]}>
      <sphereGeometry args={[1.4, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} />
    </mesh>
  )
}

function OrbitingParticles({ count = 30, color = "#FFD700" }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.6 + Math.random() * 0.8
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.5
      pos[i * 3 + 2] = Math.cos(phi) * r
    }
    return pos
  }, [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.2
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

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
    return new THREE.ExtrudeGeometry(shape, { steps: 8, depth: 0.8, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.02, bevelSegments: 4 })
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.3
    liquidRef.current.position.y = Math.sin(t * 0.5) * 0.05
  })

  return (
    <group ref={meshRef as any}>
      <mesh geometry={bottleShape} position={[0, 0, 0]}>
        <meshPhysicalMaterial color={color} transparent opacity={0.4} roughness={0.2} metalness={0.1} envMapIntensity={0.5} />
      </mesh>
      <mesh ref={liquidRef} position={[0, -0.2, 0]} scale={[0.7, 0.6, 0.7]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={liquidColor} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.3, 8]} />
        <meshPhysicalMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.7, 32]} />
        <meshBasicMaterial color={liquidColor} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function GLBMango() {
  const { scene } = useGLTF("/models/mango.glb")
  return <primitive object={scene.clone(true)} scale={0.8} />
}

function ProceduralMango() {
  const mangoGeo = useMemo(() => createMangoGeometryLite(), [])
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.0}>
      <mesh geometry={mangoGeo} castShadow>
        <meshStandardMaterial vertexColors roughness={0.4} metalness={0.0} />
      </mesh>
      <mesh position={[0.02, 0.52, 0]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.015, 0.025, 0.08, 6]} />
        <meshStandardMaterial color="#5C3A1E" roughness={0.9} />
      </mesh>
      <mesh position={[0.04, 0.58, 0]} rotation={[0.8, 0.3, 0.6]}>
        <planeGeometry args={[0.08, 0.18]} />
        <meshStandardMaterial color="#22c55e" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
    </Float>
  )
}

function RealisticMango() {
  return (
    <Suspense fallback={<ProceduralMango />}>
      <GLBMango />
    </Suspense>
  )
}

function Particles() {
  const count = 120
  const ref = useRef<THREE.Points>(null!)

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
      spd[i] = 0.2 + Math.random() * 0.5
    }
    return [pos, spd]
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.001
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#FFD700" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function Scene({ bottleColor, liquidColor }: { bottleColor: string; liquidColor: string }) {
  const controlsRef = useRef<any>(null!)

  return (
    <>
      <ambientLight intensity={0.2} />
      <hemisphereLight args={["#ffe6c7", "#1a2a3a", 0.6]} />
      <directionalLight position={[8, 8, 4]} intensity={1.0} />
      <directionalLight position={[-4, -2, -6]} intensity={0.2} color="#FFD700" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color={liquidColor} />

      <Stars radius={30} depth={50} count={200} factor={3} saturation={0} fade speed={1} />

      {/* Pulsing glow behind mango */}
      <PulsingGlow color={liquidColor} />

      {/* Orbiting rings */}
      <GlowRing color={liquidColor} radius={1.2} speed={0.5} />
      <GlowRing color="#FFD700" radius={1.5} speed={-0.3} />

      {/* Orbiting particles */}
      <OrbitingParticles count={30} color="#FFD700" />
      <OrbitingParticles count={20} color={liquidColor} />

      {/* Main mango */}
      <group position={[0, 0.3, 0]} scale={2.5}>
        <RealisticMango />
      </group>

      {/* Bottle */}
      <group position={[1.8, -0.8, 0]} scale={0.4}>
        <Bottle color={bottleColor} liquidColor={liquidColor} />
      </group>

      {/* Ground reflection ring */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 2.4, 48]} />
        <meshBasicMaterial color={liquidColor} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

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
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
        <Scene bottleColor={bottleColor} liquidColor={liquidColor} />
      </Canvas>
    </div>
  )
}
