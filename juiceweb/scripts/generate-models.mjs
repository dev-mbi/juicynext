import * as THREE from "three"
import { Document, NodeIO } from "@gltf-transform/core"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

// Geometry generation functions
function createMangoGeometry() {
  const geo = new THREE.SphereGeometry(0.4, 24, 18)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    x *= 0.85; y *= 1.3; z *= 0.75
    const side = Math.sign(x)
    x *= 1 + side * 0.08 * (1 - Math.abs(y)) * (1 - Math.abs(z) * 0.5)
    x *= 1 + 0.15 * Math.max(0, -y) * Math.max(0, -x) * 2
    z *= 1 + 0.06 * Math.max(0, -y)
    x *= 1 - 0.08 * Math.max(0, -x) * (1 - Math.abs(y)) * Math.exp(-z * z * 4)
    pos.setXYZ(i, x, y, z)
    const greenT = Math.max(0, Math.min(1, (y + 1) * 0.6))
    const blushT = Math.max(0, Math.min(1, (-y + 0.3))) * Math.max(0, Math.min(1, x + 0.3))
    let r = 0.95 - blushT * 0.3, g = 0.7 * greenT + 0.3, b = 0.1 * greenT + 0.05
    const noise = 1 + Math.sin(x * 12 + y * 8 + z * 10) * 0.03
    r *= noise; g *= noise; b *= noise
    colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

function createStrawberryGeometry() {
  const geo = new THREE.SphereGeometry(0.35, 20, 18)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    x *= 0.8 * (1 + y * 0.15); z *= 0.8 * (1 + y * 0.15); y *= 1.1
    if (y > 0.7) y *= 1 - (y - 0.7) * 0.5
    const seed = Math.max(0, Math.sin(x * 10 + y * 8 + z * 12) * 0.04)
    x += seed * Math.sign(x); z += seed * Math.sign(z)
    pos.setXYZ(i, x, y, z)
    const topT = Math.max(0, Math.min(1, (y + 0.5) * 0.8))
    let r = 0.95 - topT * 0.3, g = 0.1 + topT * 0.3, b = 0.15 + topT * 0.2
    const noise = 1 + Math.sin(x * 15 + z * 12) * 0.02
    r *= noise; g *= noise; b *= noise
    colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

function createOrangeGeometry() {
  const geo = new THREE.SphereGeometry(0.35, 20, 18)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    y *= 0.9
    const bump = 1 + Math.sin(x * 12 + y * 10 + z * 14) * 0.025
    x *= bump; y *= bump; z *= bump
    const navel = 1 - 0.08 * Math.exp(-x * x * 8 - z * z * 8) * Math.exp(-y * y * 4)
    if (Math.abs(y) > 0.6) { x *= navel; z *= navel }
    pos.setXYZ(i, x, y, z)
    let r = 1.0, g = 0.55, b = 0.05
    const shade = 0.85 + Math.random() * 0.15
    r *= shade; g *= shade; b *= shade
    colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

function createFalsaGeometry() {
  const geo = new THREE.SphereGeometry(0.25, 20, 18)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const bump = 1 + Math.sin(x * 14 + y * 16 + z * 12) * 0.03
    x *= bump; y *= bump; z *= bump
    pos.setXYZ(i, x, y, z)
    const shade = 0.7 + Math.random() * 0.3
    colors[i * 3] = 0.4 * shade; colors[i * 3 + 1] = 0.05 * shade; colors[i * 3 + 2] = 0.6 * shade
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

function geoToGLTFTransform(name, geo) {
  const pos = geo.attributes.position
  const norm = geo.attributes.normal
  const col = geo.attributes.color
  const idx = geo.index

  const vertexCount = pos.count
  const posArr = new Float32Array(pos.array)
  const normArr = new Float32Array(norm.array)
  const colArr = new Float32Array(col.array)
  const idxArr = idx ? new Uint16Array(idx.array) : new Uint16Array(vertexCount).map((_, i) => i)

  const doc = new Document()
  const buffer = doc.createBuffer(name)

  const position = doc.createAccessor().setArray(posArr).setType("VEC3")
  const normal = doc.createAccessor().setArray(normArr).setType("VEC3")
  const color = doc.createAccessor().setArray(colArr).setType("VEC3")
  const indices = doc.createAccessor().setArray(idxArr).setType("SCALAR")

  const mesh = doc.createMesh(name)
    .addPrimitive(doc.createPrimitive()
      .setIndices(indices)
      .setAttribute("POSITION", position)
      .setAttribute("NORMAL", normal)
      .setAttribute("COLOR_0", color))

  doc.createScene().addChild(doc.createNode(name).setMesh(mesh))
  return doc
}

const outDir = join(process.cwd(), "public", "models")
mkdirSync(outDir, { recursive: true })

const models = [
  { name: "mango", geo: createMangoGeometry() },
  { name: "strawberry", geo: createStrawberryGeometry() },
  { name: "orange", geo: createOrangeGeometry() },
  { name: "falsa", geo: createFalsaGeometry() },
]

const io = new NodeIO()

for (const m of models) {
  try {
    const doc = geoToGLTFTransform(m.name, m.geo)
    const path = join(outDir, `${m.name}.glb`)
    await io.write(path, doc)
    const stats = await import("fs").then(fs => fs.promises.stat(path))
    console.log(`  ✅ ${m.name}.glb (${(stats.size / 1024).toFixed(1)} KB)`)
  } catch (err) {
    console.error(`  ❌ ${m.name}: ${err.message}`)
  }
}

console.log("\n🎉 All models generated in public/models/")
