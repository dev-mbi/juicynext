"use client"

import { useRef, useState, useMemo, useEffect, useCallback, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, OrbitControls, Stars, Environment, Cloud, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"
import { playSplash, playBassImpact, startAmbient } from "@/lib/sound"
import { getFruitGeometry } from "@/lib/geometries"

// ─── FRUIT CONFIG ──────────────────────────────────────────────────

type FruitConfig = {
  id: string
  name: string
  color: string
  glowColor: string
  modelPath: string
  stem?: boolean
  leaf?: boolean
}

const fruitConfigs: FruitConfig[] = [
  { id: "mango", name: "Mango", color: "#FFA500", glowColor: "#FFD700", modelPath: "/models/mango.glb", stem: true, leaf: true },
  { id: "strawberry", name: "Strawberry", color: "#FF1493", glowColor: "#FF0066", modelPath: "/models/strawberry.glb", leaf: true },
  { id: "orange", name: "Orange", color: "#FF5E00", glowColor: "#FF8C00", modelPath: "/models/orange.glb" },
  { id: "falsa", name: "Falsa", color: "#6A0DAD", glowColor: "#8B00FF", modelPath: "/models/falsa.glb" },
]

type FruitInstance = {
  config: FruitConfig
  pos: THREE.Vector3
  target: THREE.Vector3
  velocity: THREE.Vector3
  orbitAngle: number
  orbitRadius: number
  phase: "orbit" | "rush" | "merge"
  phaseTimer: number
  scale: number
  opacity: number
}

type Particle = {
  pos: THREE.Vector3
  vel: THREE.Vector3
  color: string
  life: number
  maxLife: number
  size: number
}

type FlavorResult = {
  name: string
  tagline: string
  color1: string
  color2: string
}

const flavorMap: Record<string, FlavorResult> = {
  "mango+strawberry": { name: "Mango Berry Blast", tagline: "Sweet & Bold", color1: "#FF1493", color2: "#FFA500" },
  "mango+orange": { name: "Mango Rush", tagline: "Feel the Rush", color1: "#FFD700", color2: "#FF6B00" },
  "mango+falsa": { name: "Falsa Fusion", tagline: "Enter the Purple Energy", color1: "#8B00FF", color2: "#FF6B00" },
  "strawberry+orange": { name: "Citrus Berry", tagline: "Electric Sunrise", color1: "#FF5E00", color2: "#FF1493" },
  "strawberry+falsa": { name: "Berry Fusion", tagline: "Purple Energy", color1: "#8B00FF", color2: "#FF1493" },
  "orange+falsa": { name: "Citrus Falsa", tagline: "Tangy Twilight", color1: "#FF5E00", color2: "#8B00FF" },
}

function getCombo(a: string, b: string): FlavorResult | null {
  const key = [a, b].sort().join("+")
  return flavorMap[key] || null
}

// ─── GLB MODEL WITH FALLBACK ──────────────────────────────────────

function GLBFruit({ fruit }: { fruit: FruitInstance }) {
  const { scene } = useGLTF(fruit.config.modelPath)
  const groupRef = useRef<THREE.Group>(null!)
  const currentScale = useRef(0.01)

  useFrame(() => {
    if (!groupRef.current) return
    currentScale.current += (fruit.scale - currentScale.current) * 0.05
    groupRef.current.position.copy(fruit.pos)
    groupRef.current.scale.setScalar(currentScale.current * 0.8)
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene.clone(true)} />
    </group>
  )
}

function ProceduralFruit({ fruit }: { fruit: FruitInstance }) {
  const geo = useMemo(() => getFruitGeometry(fruit.config.id), [fruit.config.id])
  const meshRef = useRef<THREE.Mesh>(null!)
  const stemRef = useRef<THREE.Mesh>(null!)
  const leafRef = useRef<THREE.Mesh>(null!)
  const currentScale = useRef(0.01)

  useFrame(() => {
    if (!meshRef.current) return
    currentScale.current += (fruit.scale - currentScale.current) * 0.05
    meshRef.current.position.copy(fruit.pos)
    meshRef.current.scale.setScalar(currentScale.current)
    if (stemRef.current) {
      stemRef.current.position.copy(fruit.pos)
      stemRef.current.position.y += 0.45
    }
    if (leafRef.current) {
      leafRef.current.position.copy(fruit.pos)
      leafRef.current.position.y += 0.52
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geo}>
        <meshPhysicalMaterial
          vertexColors roughness={0.3} metalness={0.0}
          clearcoat={0.2} clearcoatRoughness={0.3} envMapIntensity={0.5}
        />
      </mesh>
      {fruit.config.stem && (
        <mesh ref={stemRef}>
          <cylinderGeometry args={[0.012, 0.02, 0.06, 6]} />
          <meshPhysicalMaterial color="#5C3A1E" roughness={0.9} />
        </mesh>
      )}
      {fruit.config.leaf && (
        <mesh ref={leafRef} rotation={[0.8, 0.3, 0.6]}>
          <planeGeometry args={[0.06, 0.14]} />
          <meshPhysicalMaterial color="#22c55e" side={THREE.DoubleSide} roughness={0.7} />
        </mesh>
      )}
    </group>
  )
}

// ─── FRUIT MESH COMPONENT ──────────────────────────────────────────

function FruitMesh({ fruit, highlighted }: { fruit: FruitInstance; highlighted: boolean }) {
  return (
    <group>
      {highlighted && (
        <mesh position={fruit.pos.toArray() as [number, number, number]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color={fruit.config.glowColor} transparent opacity={0.2} />
        </mesh>
      )}
      <Suspense fallback={<ProceduralFruit fruit={fruit} />}>
        <GLBFruit fruit={fruit} />
      </Suspense>
    </group>
  )
}

// ─── PARTICLE SYSTEM ───────────────────────────────────────────────

function JuiceSplash({ particles: p }: { particles: Particle[] }) {
  const ref = useRef<THREE.Points>(null!)
  const count = p.length
  const positions = useMemo(() => new Float32Array(count * 3), [count])
  const colors = useMemo(() => new Float32Array(count * 3), [count])
  const sizes = useMemo(() => new Float32Array(count), [count])

  p.forEach((pt, i) => {
    positions[i * 3] = pt.pos.x
    positions[i * 3 + 1] = pt.pos.y
    positions[i * 3 + 2] = pt.pos.z
    const c = new THREE.Color(pt.color)
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    sizes[i] = pt.size
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── RESULT BOTTLE ─────────────────────────────────────────────────

function ResultBottle({ result }: { result: FlavorResult }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const capRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.6
      meshRef.current.position.y = Math.sin(t * 1.2) * 0.1
    }
    if (capRef.current) {
      capRef.current.rotation.y = t * 0.6
      capRef.current.position.y = 0.55 + Math.sin(t * 1.2) * 0.1
    }
  })

  return (
    <group position={[0, 0.3, 0]}>
      {/* Glow aura */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color={result.color1} transparent opacity={0.12} />
      </mesh>

      {/* Bottle body */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.2, 0.3, 1.0, 20]} />
        <meshPhysicalMaterial
          color={result.color1}
          emissive={result.color2}
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.2}
          clearcoat={0.3}
        />
      </mesh>

      {/* Cap */}
      <mesh ref={capRef}>
        <cylinderGeometry args={[0.12, 0.15, 0.1, 12]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Inner liquid glow */}
      <mesh position={[0, -0.05, 0]} scale={[0.5, 0.4, 0.5]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={result.color2} transparent opacity={0.25} />
      </mesh>

      {/* Orbiting particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <OrbitRing key={i} index={i} color={result.color2} />
      ))}

      {/* Name text floating above */}
      <Text position={[0, 1.0, 0]} fontSize={0.12} color={result.color2} anchorX="center" anchorY="bottom">
        {result.name}
      </Text>
    </group>
  )
}

function OrbitRing({ index, color }: { index: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  const angle = (index / 10) * Math.PI * 2

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime() * 0.7
    ref.current.position.x = Math.cos(angle + t) * 0.7
    ref.current.position.z = Math.sin(angle + t) * 0.7
    ref.current.position.y = Math.sin(t * 2 + index) * 0.15
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// ─── CAMERA SHAKE ──────────────────────────────────────────────────

function CameraShake({ trigger }: { trigger: number }) {
  const { camera } = useThree()
  const originRef = useRef({ x: 0, y: 0 })
  const prevTrigger = useRef(trigger)

  useEffect(() => {
    if (trigger === 0 || trigger === prevTrigger.current) return
    prevTrigger.current = trigger

    const intensity = 0.12
    const decay = 0.9
    const duration = 0.4

    gsap.to(camera.position, {
      x: camera.position.x + (Math.random() - 0.5) * intensity,
      y: camera.position.y + (Math.random() - 0.5) * intensity,
      duration: 0.05,
      repeat: Math.floor(duration / 0.05),
      yoyo: true,
      ease: "power2.out",
      onUpdate: function () {
        const progress = this.progress()
        camera.position.x += (Math.random() - 0.5) * intensity * Math.pow(decay, progress * 10)
        camera.position.y += (Math.random() - 0.5) * intensity * Math.pow(decay, progress * 10)
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return null
}

// ─── MAIN SCENE ────────────────────────────────────────────────────

function Scene() {
  const [fruits, setFruits] = useState<FruitInstance[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [result, setResult] = useState<FlavorResult | null>(null)
  const [highlighted, setHighlighted] = useState<string[]>([])
  const [statusText, setStatusText] = useState("")
  const [shakeTrigger, setShakeTrigger] = useState(0)
  const stateRef = useRef({ phase: "idle" as string, mergeTimer: 0, lastMerge: 0 })
  const idCounter = useRef(0)

  // Initialize fruits
  useEffect(() => {
    const initial: FruitInstance[] = fruitConfigs.map((cfg, i) => {
      const angle = (i / fruitConfigs.length) * Math.PI * 2
      const radius = 2.0 + Math.random() * 0.3
      return {
        config: cfg,
        pos: new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 0.5, Math.sin(angle) * radius),
        target: new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
        velocity: new THREE.Vector3(),
        orbitAngle: angle,
        orbitRadius: radius,
        phase: "orbit" as const,
        phaseTimer: 3 + Math.random() * 5,
        scale: 1,
        opacity: 1,
      }
    })
    setFruits(initial)
    setStatusText("🥭 Fruits are floating — watch them combine!")
    startAmbient()
  }, [])

  // Auto-merge logic
  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime()

    setFruits((prev) => {
      const updated = prev.map((f) => ({ ...f }))

      // Orbit phase
      updated.forEach((f) => {
        if (f.phase === "orbit") {
          f.orbitAngle += delta * 0.15
          const tx = Math.cos(f.orbitAngle) * f.orbitRadius
          const tz = Math.sin(f.orbitAngle) * f.orbitRadius

          f.pos.x += (tx - f.pos.x) * delta * 0.8
          f.pos.z += (tz - f.pos.z) * delta * 0.8
          f.pos.y = Math.sin(elapsed * 0.5 + f.orbitAngle) * 0.4
        }
      })

      // Pick 2 fruits to merge every ~6 seconds
      stateRef.current.mergeTimer += delta
      if (stateRef.current.mergeTimer > 5 + Math.random() * 3 && !result) {
        stateRef.current.mergeTimer = 0

        const orbitFruits = updated.filter((f) => f.phase === "orbit")
        if (orbitFruits.length >= 2) {
          // Pick 2 random different fruits
          const shuffled = [...orbitFruits].sort(() => Math.random() - 0.5)
          const a = shuffled[0]
          const b = shuffled[1]
          if (a.config.id !== b.config.id) {
            a.phase = "rush"
            b.phase = "rush"
            a.phaseTimer = 2
            b.phaseTimer = 2
            setHighlighted([a.config.id, b.config.id])
            setStatusText(`⚡ ${a.config.name} + ${b.config.name} — merging...`)
          }
        }
      }

      // Rush phase — fruits fly to center
      let merging = false
      updated.forEach((f) => {
        if (f.phase === "rush") {
          merging = true
          f.phaseTimer -= delta
          const target = new THREE.Vector3(0, 0.2, 0)
          f.pos.lerp(target, delta * 1.5)
          f.scale += (0.3 - f.scale) * delta * 3
          if (f.phaseTimer <= 0 || f.pos.distanceTo(target) < 0.15) {
            f.phase = "merge"
            f.pos.copy(target)
          }
        }
      })

      // If any fruits are merging, trigger explosion and result
      if (!merging && updated.some((f) => f.phase === "merge")) {
        const merged = updated.filter((f) => f.phase === "merge")
        if (merged.length >= 2) {
          const a = merged[0].config.id
          const b = merged[1].config.id
          const combo = getCombo(a, b)

          // Create particle splash
          const pArr: Particle[] = []
          const colors = combo ? [combo.color1, combo.color2] : ["#FFD700", "#FF6B00"]
          playSplash()
          setShakeTrigger(Date.now())
          for (let i = 0; i < 65; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const speed = 1.5 + Math.random() * 3
            pArr.push({
              pos: new THREE.Vector3(0, 0.2, 0),
              vel: new THREE.Vector3(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed + 1,
                Math.cos(phi) * speed,
              ),
              color: colors[i % 2],
              life: 1,
              maxLife: 1.2 + Math.random() * 0.5,
              size: 0.04 + Math.random() * 0.06,
            })
          }
          setParticles(pArr)

          if (combo) {
            setTimeout(() => {
              playBassImpact()
              setResult(combo)
              setStatusText(`✨ ${combo.name} — ${combo.tagline}`)
              setHighlighted([])
            }, 300)
          } else {
            setStatusText("💥 Mystery flavor!")
            setTimeout(() => setStatusText(""), 1500)
          }

          // Remove merged fruits
          return updated.filter((f) => f.phase !== "merge")
        }
      }

      return updated
    })

    // Update particles
    setParticles((prev) => {
      const alive = prev
        .map((p) => {
          p.pos.add(p.vel.clone().multiplyScalar(delta))
          p.vel.multiplyScalar(0.97)
          p.vel.y -= delta * 1.5
          p.life -= delta / p.maxLife
          return p
        })
        .filter((p) => p.life > 0)
      return alive
    })
  })

  // Respawn all fruits after result shown
  useEffect(() => {
    if (!result) return
    const timer = setTimeout(() => {
      setResult(null)
      setStatusText("🥭 Fruits are floating — watch them combine!")
      setHighlighted([])
      setFruits(
        fruitConfigs.map((cfg, i) => {
          const angle = (i / fruitConfigs.length) * Math.PI * 2 + Math.random() * 0.5
          const radius = 2.0 + Math.random() * 0.3
          return {
            config: cfg,
            pos: new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 0.5, Math.sin(angle) * radius),
            target: new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
            velocity: new THREE.Vector3(),
            orbitAngle: angle,
            orbitRadius: radius,
            phase: "orbit" as const,
            phaseTimer: 3 + Math.random() * 5,
            scale: 0.01,
            opacity: 1,
          }
        }),
      )
      stateRef.current.mergeTimer = 4
    }, 4000)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  return (
    <>
      <color args={["#0a0612"]} attach="background" />
      <fog attach="fog" args={["#0a0612", 6, 12]} />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#ffeedd", "#001133", 0.6]} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <pointLight position={[0, 2, 0]} intensity={0.6} color="#FF6B00" />

      <Environment preset="night" />

      <Stars radius={20} depth={40} count={300} factor={3} saturation={0} fade speed={1} />

      {/* Floating clouds */}
      <Cloud position={[-3, 2, -2]} speed={0.25} opacity={0.12} color="#FFD700" />
      <Cloud position={[3, 2.5, -1]} speed={0.2} opacity={0.08} color="#FF6B00" />
      <Cloud position={[0, 3.5, -3]} speed={0.3} opacity={0.06} color="#fff" />

      {/* Center glow platform */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.0, 48]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* Fruits */}
      {fruits.map((f, i) => (
        <FruitMesh key={`${f.config.id}-${i}`} fruit={f} highlighted={highlighted.includes(f.config.id)} />
      ))}

      {/* Particles */}
      {particles.length > 0 && <JuiceSplash particles={particles} />}

      {/* Result bottle */}
      {result && <ResultBottle result={result} />}

      {/* Status text */}
      {statusText && (
        <Text position={[0, -1.9, 0]} fontSize={0.1} color="#aaa" anchorX="center" anchorY="top">
          {statusText}
        </Text>
      )}

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />

      <CameraShake trigger={shakeTrigger} />
    </>
  )
}

export default function FlavorForge({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-[400px] sm:h-[500px] md:h-[700px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
    </div>
  )
}
