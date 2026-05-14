import * as THREE from "three"

export function createMangoGeometryLite(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.4, 16, 12)
  const pos = geo.attributes.position as THREE.BufferAttribute
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

export function createMangoGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.4, 24, 18)
  const pos = geo.attributes.position as THREE.BufferAttribute
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

export function createStrawberryGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.35, 20, 18)
  const pos = geo.attributes.position as THREE.BufferAttribute
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

export function createOrangeGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.35, 20, 18)
  const pos = geo.attributes.position as THREE.BufferAttribute
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

export function createFalsaGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.25, 20, 18)
  const pos = geo.attributes.position as THREE.BufferAttribute
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

const fruitGeometryMap: Record<string, () => THREE.BufferGeometry> = {
  mango: createMangoGeometry,
  strawberry: createStrawberryGeometry,
  orange: createOrangeGeometry,
  falsa: createFalsaGeometry,
}

export function getFruitGeometry(id: string): THREE.BufferGeometry {
  const fn = fruitGeometryMap[id]
  if (!fn) return createMangoGeometry()
  return fn()
}
