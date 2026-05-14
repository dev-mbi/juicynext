let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === "suspended") ctx.resume()
  return ctx
}

export function playSplash() {
  const c = getCtx()
  const bufferSize = c.sampleRate * 0.3
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    const t = i / c.sampleRate
    const decay = Math.exp(-t * 12)
    data[i] = (Math.random() * 2 - 1) * decay * 0.3
  }
  const src = c.createBufferSource()
  src.buffer = buffer
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.4, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3)
  const filter = c.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = 2000
  filter.Q.value = 0.5
  src.connect(filter).connect(gain).connect(c.destination)
  src.start()
}

export function playBassImpact() {
  const c = getCtx()
  const osc = c.createOscillator()
  osc.type = "sine"
  osc.frequency.setValueAtTime(80, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(30, c.currentTime + 0.5)
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.6, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5)
  const distortion = c.createWaveShaper()
  const k = 2
  distortion.curve = new Float32Array(44100).map((_, i) => {
    const x = (i / 22050) * k
    return Math.sign(x) * (1 - Math.exp(-Math.abs(x)))
  })
  osc.connect(distortion).connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.5)
}

let ambientGain: GainNode | null = null
let ambientOscs: OscillatorNode[] = []

export function startAmbient() {
  const c = getCtx()
  if (ambientGain) return
  ambientGain = c.createGain()
  ambientGain.gain.setValueAtTime(0.08, c.currentTime)
  ambientGain.connect(c.destination)

  const freqs = [55, 110, 165, 220]
  ambientOscs = freqs.map((freq) => {
    const osc = c.createOscillator()
    osc.type = "sine"
    osc.frequency.value = freq
    const gain = c.createGain()
    gain.gain.value = 0.02
    const filter = c.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 400
    osc.connect(gain).connect(filter).connect(ambientGain!)
    osc.start()
    return osc
  })

  const lfo = c.createOscillator()
  lfo.frequency.value = 0.1
  const lfoGain = c.createGain()
  lfoGain.gain.value = 0.03
  lfo.connect(lfoGain).connect(ambientGain.gain)
  lfo.start()
  ambientOscs.push(lfo)
}

export function stopAmbient() {
  ambientOscs.forEach((o) => { try { o.stop() } catch {} })
  ambientOscs = []
  ambientGain?.disconnect()
  ambientGain = null
}
