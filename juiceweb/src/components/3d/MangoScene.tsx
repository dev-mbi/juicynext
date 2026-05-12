"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Stars, MeshTransmissionMaterial, OrbitControls } from "@react-three/drei"
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

function RealisticMango() {
  const meshRef = useRef<THREE.Mesh>(null!)

  const mangoGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.4, 48, 36)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i)
      let z = pos.getZ(i)

      const len = Math.sqrt(x * x + y * y + z * z)
      const nx = x / len, ny = y / len, nz = z / len

      // Stretch to ellipsoid (mango is oval)
      x *= 0.85
      y *= 1.25
      z *= 0.75

      // Kidney shape: bulge one side, flatten the other
      const side = Math.sign(x)
      const bulge = 1 + side * 0.08 * (1 - Math.abs(y)) * (1 - Math.abs(z) * 0.5)
      x *= bulge

      // Slight hook/beak at top
      const beak = 1 + 0.12 * Math.max(0, -y) * Math.max(0, -x) * 2
      x *= beak
      z *= 1 + 0.06 * Math.max(0, -y)

      // Crease along one side (mango characteristic)
      const crease = 1 - 0.08 * Math.max(0, -x) * (1 - Math.abs(y)) * Math.exp(-z * z * 4)
      x *= crease

      pos.setXYZ(i, x, y, z)

      // Color: gradient from green (top) → yellow → orange → red (bottom/blush)
      const greenT = Math.max(0, Math.min(1, (y + 1) * 0.6))
      const blushT = Math.max(0, Math.min(1, (-y + 0.3))) * Math.max(0, Math.min(1, x + 0.3))

      let r = 0.95 - blushT * 0.3
      let g = 0.7 * greenT + 0.3 * (1 - blushT)
      let b = 0.1 * greenT + 0.05 * (1 - blushT)

      // Add slight natural variation
      const noise = 1 + (Math.sin(x * 12 + y * 8 + z * 10) * 0.03)
      r *= noise; g *= noise; b *= noise

      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.05
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.2}>
      {/* Mango body */}
      <mesh ref={meshRef} geometry={mangoGeo} castShadow>
        <meshPhysicalMaterial
          vertexColors
          roughness={0.35}
          metalness={0.0}
          clearcoat={0.15}
          clearcoatRoughness={0.3}
          envMapIntensity={0.6}
          ior={1.4}
        />
      </mesh>

      {/* Stem */}
      <mesh position={[0.02, 0.52, 0]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.015, 0.025, 0.08, 6]} />
        <meshPhysicalMaterial color="#5C3A1E" roughness={0.9} />
      </mesh>

      {/* Leaf */}
      <mesh position={[0.04, 0.58, 0]} rotation={[0.8, 0.3, 0.6]}>
        <planeGeometry args={[0.08, 0.18]} />
        <meshPhysicalMaterial
          color="#22c55e"
          side={THREE.DoubleSide}
          roughness={0.7}
          metalness={0.0}
        />
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
      <ambientLight intensity={0.2} />
      <hemisphereLight args={["#ffe6c7", "#1a2a3a", 0.6]} />
      <directionalLight position={[8, 8, 4]} intensity={1.0} />
      <directionalLight position={[-4, -2, -6]} intensity={0.2} color="#FFD700" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color={liquidColor} />

      <Stars radius={30} depth={50} count={500} factor={4} saturation={0} fade speed={1} />

      <group position={[0, 0, 0]}>
        <Bottle color={bottleColor} liquidColor={liquidColor} />
        <group position={[1.2, -0.5, 0]}>
          <RealisticMango />
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
