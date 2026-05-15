function createMangoScene(containerId, bottleColor = '#FFD700', liquidColor = '#FF6B00') {
  const container = document.getElementById(containerId)
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 5)

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)
  const hemiLight = new THREE.HemisphereLight(0xffe6c7, 0x1a2a3a, 0.6)
  scene.add(hemiLight)
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(8, 8, 4)
  scene.add(dirLight)
  const dirLight2 = new THREE.DirectionalLight(0xFFD700, 0.2)
  dirLight2.position.set(-4, -2, -6)
  scene.add(dirLight2)
  const pointLight = new THREE.PointLight(liquidColor, 0.8, 10)
  pointLight.position.set(0, 3, 2)
  scene.add(pointLight)

  const starsGeo = new THREE.BufferGeometry()
  const starsCount = 200
  const starPos = new Float32Array(starsCount * 3)
  for (let i = 0; i < starsCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 60
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8 })
  const stars = new THREE.Points(starsGeo, starsMat)
  scene.add(stars)

  // Pulsing glow
  const glowGeo = new THREE.SphereGeometry(1.4, 24, 24)
  const glowMat = new THREE.MeshBasicMaterial({ color: liquidColor, transparent: true, opacity: 0.08 })
  const glowMesh = new THREE.Mesh(glowGeo, glowMat)
  glowMesh.position.set(0, 0.3, 0)
  scene.add(glowMesh)

  // Rings
  function createRing(color, radius, speed) {
    const geo = new THREE.RingGeometry(radius - 0.05, radius, 48)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15, side: THREE.DoubleSide })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = Math.PI / 2.2
    mesh.userData = { speed }
    scene.add(mesh)
    return mesh
  }
  const ring1 = createRing(liquidColor, 1.2, 0.5)
  const ring2 = createRing('#FFD700', 1.5, -0.3)

  // Orbiting particles
  function createOrbitParticles(count, color) {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.6 + Math.random() * 0.8
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.5
      pos[i * 3 + 2] = Math.cos(phi) * r
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ size: 0.04, color, transparent: true, opacity: 0.6, sizeAttenuation: true })
    const mesh = new THREE.Points(geo, mat)
    scene.add(mesh)
    return mesh
  }
  const orbit1 = createOrbitParticles(30, '#FFD700')
  const orbit2 = createOrbitParticles(20, liquidColor)

  // Bottle using lathe geometry
  function createBottle(color, liquidColor) {
    const group = new THREE.Group()
    const points = []
    points.push(new THREE.Vector2(0.3, -2))
    points.push(new THREE.Vector2(0.28, -1.6))
    points.push(new THREE.Vector2(0.35, -1))
    points.push(new THREE.Vector2(0.35, -0.5))
    points.push(new THREE.Vector2(0.35, 0.5))
    points.push(new THREE.Vector2(0.25, 1))
    points.push(new THREE.Vector2(0.15, 1.5))
    points.push(new THREE.Vector2(0.08, 2))
    points.push(new THREE.Vector2(0.2, 2.3))
    points.push(new THREE.Vector2(0, 2.4))
    const geo = new THREE.LatheGeometry(points, 24)
    const mat = new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.4, roughness: 0.2, metalness: 0.1 })
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)

    const liquidGeo = new THREE.SphereGeometry(0.35, 16, 16)
    const liquidMat = new THREE.MeshBasicMaterial({ color: liquidColor, transparent: true, opacity: 0.6 })
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat)
    liquidMesh.position.set(0, -0.2, 0)
    liquidMesh.scale.set(0.7, 0.6, 0.7)
    liquidMesh.userData = { isLiquid: true }
    group.add(liquidMesh)

    const capGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.3, 8)
    const capMat = new THREE.MeshPhysicalMaterial({ color: '#222', metalness: 0.8, roughness: 0.2 })
    const cap = new THREE.Mesh(capGeo, capMat)
    cap.position.set(0, 2.2, 0)
    group.add(cap)

    return group
  }

  const bottleGroup = createBottle(bottleColor, liquidColor)
  bottleGroup.position.set(1.8, -0.8, 0)
  bottleGroup.scale.set(0.4, 0.4, 0.4)
  scene.add(bottleGroup)

  // Ground ring
  const groundRing = new THREE.Mesh(
    new THREE.RingGeometry(1.6, 2.4, 48),
    new THREE.MeshBasicMaterial({ color: liquidColor, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
  )
  groundRing.rotation.x = -Math.PI / 2
  groundRing.position.set(0, -0.7, 0)
  scene.add(groundRing)

  // Mango using icosahedron
  const mangoGeo = new THREE.IcosahedronGeometry(0.35, 1)
  const mangoMat = new THREE.MeshStandardMaterial({
    color: 0xFFA500,
    roughness: 0.4,
    metalness: 0.0,
    flatShading: false,
  })
  const mango = new THREE.Mesh(mangoGeo, mangoMat)
  mango.scale.set(1, 1.15, 0.85)
  mango.position.set(0, 0.3, 0)
  scene.add(mango)

  const blushGeo = new THREE.IcosahedronGeometry(0.36, 1)
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xFF3D00, transparent: true, opacity: 0.15 })
  const blush = new THREE.Mesh(blushGeo, blushMat)
  blush.scale.set(0.9, 1.1, 0.8)
  blush.position.set(0.1, 0.25, 0.1)
  scene.add(blush)

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x5C3A1E, roughness: 0.9 })
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, 0.08, 6), stemMat)
  stem.position.set(0.02, 0.52, 0)
  stem.rotation.set(0.3, 0, 0.2)
  scene.add(stem)

  // Background particles
  const bgParticleCount = 120
  const bgPos = new Float32Array(bgParticleCount * 3)
  const bgSpeeds = new Float32Array(bgParticleCount)
  for (let i = 0; i < bgParticleCount; i++) {
    bgPos[i * 3] = (Math.random() - 0.5) * 20
    bgPos[i * 3 + 1] = (Math.random() - 0.5) * 20
    bgPos[i * 3 + 2] = (Math.random() - 0.5) * 20
    bgSpeeds[i] = 0.2 + Math.random() * 0.5
  }
  const bgParticles = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({ size: 0.03, color: 0xFFD700, transparent: true, opacity: 0.5, sizeAttenuation: true })
  )
  bgParticles.geometry.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
  scene.add(bgParticles)

  const clock = new THREE.Clock()

  function animate() {
    requestAnimationFrame(animate)
    const t = clock.getElapsedTime()

    glowMesh.scale.setScalar(1 + Math.sin(t * 1.2) * 0.15)
    glowMat.opacity = 0.08 + Math.sin(t * 1.5) * 0.04

    ring1.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.15) * 0.1
    ring1.rotation.z = Math.cos(t * 0.1) * 0.1
    ring2.rotation.x = Math.PI / 2.2 + Math.sin(t * -0.09) * 0.1
    ring2.rotation.z = Math.cos(t * -0.06) * 0.1

    orbit1.rotation.y = t * 0.2
    orbit1.rotation.x = Math.sin(t * 0.1) * 0.05
    orbit2.rotation.y = t * 0.15
    orbit2.rotation.x = Math.sin(t * 0.08) * 0.05

    bottleGroup.rotation.y = t * 0.3
    bottleGroup.children.forEach(child => {
      if (child.userData.isLiquid) {
        child.position.y = Math.sin(t * 0.5) * 0.05
      }
    })

    mango.position.y = 0.3 + Math.sin(t * 1.2) * 0.1
    mango.rotation.y = t * 0.3
    blush.position.y = 0.25 + Math.sin(t * 1.2) * 0.1
    blush.rotation.y = t * 0.3

    stars.rotation.y = t * 0.02

    const bgPosArr = bgParticles.geometry.attributes.position.array
    for (let i = 0; i < bgParticleCount; i++) {
      bgPosArr[i * 3 + 1] += Math.sin(t * bgSpeeds[i] + i) * 0.001
    }
    bgParticles.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', () => {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  })

  return () => { if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement) }
}

function createParticleBackground(containerId, color = '#FFD700', count = 60) {
  const container = document.getElementById(containerId)
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 6)

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  container.appendChild(renderer.domElement)

  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.random() * 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.5
    positions[i * 3 + 2] = Math.cos(phi) * r
    velocities[i * 3] = (Math.random() - 0.5) * 0.01
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
  }

  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particleMat = new THREE.PointsMaterial({ size: 0.06, color, transparent: true, opacity: 0.4, sizeAttenuation: true })
  const particleSystem = new THREE.Points(particleGeo, particleMat)
  scene.add(particleSystem)

  // Floating shapes
  function createShape(pos, color, type) {
    const group = new THREE.Group()
    let geo
    if (type === 'ring') geo = new THREE.RingGeometry(0.2, 0.3, 16)
    else if (type === 'box') geo = new THREE.BoxGeometry(0.15, 0.15, 0.15)
    else geo = new THREE.IcosahedronGeometry(0.12, 0)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3, wireframe: true })
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)
    group.position.set(pos[0], pos[1], pos[2])
    group.userData = { baseY: pos[1] }
    scene.add(group)
    return group
  }
  const shapes = [
    createShape([-2, 1, -1], color, 'sphere'),
    createShape([2.5, -0.5, -1.5], '#FF6B00', 'ring'),
    createShape([-1.5, -1.5, -2], '#FFD700', 'box'),
    createShape([1.8, 1.8, -2.5], '#FF6B00', 'sphere'),
  ]

  const clock = new THREE.Clock()
  function animate() {
    requestAnimationFrame(animate)
    const t = clock.getElapsedTime()

    const posArr = particleSystem.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += Math.sin(t + i) * 0.001 + velocities[i * 3]
      posArr[i * 3 + 1] += Math.cos(t * 0.7 + i * 0.5) * 0.001 + velocities[i * 3 + 1]
      posArr[i * 3 + 2] += Math.sin(t * 0.5 + i * 0.3) * 0.001 + velocities[i * 3 + 2]
    }
    particleSystem.geometry.attributes.position.needsUpdate = true

    shapes.forEach(shape => {
      shape.position.y = shape.userData.baseY + Math.sin(t * 0.5 + shape.position.x) * 0.5
      shape.rotation.x = t * 0.2
      shape.rotation.z = t * 0.15
    })

    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', () => {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  })
}

function createFlavorForge(containerId) {
  const container = document.getElementById(containerId)
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 5)

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  container.appendChild(renderer.domElement)

  const fruits = [
    { name: 'Mango', color: 0xFFA500, pos: [-1.5, 1, 0] },
    { name: 'Berry', color: 0xFF1493, pos: [1.5, 1, 0] },
    { name: 'Citrus', color: 0xFF5E00, pos: [-1.5, -1, 0] },
    { name: 'Grape', color: 0x8B00FF, pos: [1.5, -1, 0] },
    { name: 'Mint', color: 0x00FF88, pos: [0, 0, 0] },
  ]

  const fruitMeshes = fruits.map(f => {
    const geo = new THREE.SphereGeometry(0.3, 16, 16)
    const mat = new THREE.MeshStandardMaterial({ color: f.color, roughness: 0.3, metalness: 0.1 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(f.pos[0], f.pos[1], f.pos[2])
    mesh.userData = f
    scene.add(mesh)
    return mesh
  })

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(5, 5, 5)
  scene.add(dirLight)

  const clock = new THREE.Clock()
  function animate() {
    requestAnimationFrame(animate)
    const t = clock.getElapsedTime()
    fruitMeshes.forEach((mesh, i) => {
      mesh.position.y = mesh.userData.pos[1] + Math.sin(t * 1.2 + i * 1.5) * 0.2
      mesh.rotation.x = t * 0.5 + i
      mesh.rotation.y = t * 0.3 + i * 0.5
    })
    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', () => {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  })
}
