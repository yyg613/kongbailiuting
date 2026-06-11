import { ref, onMounted, onUnmounted } from 'vue'

export function useLeafCanvas(canvasRef) {
  let animationId = null
  let leaves = []
  let ctx = null

  const leafCount = 15

  function createLeaf(w, h) {
    return {
      x: Math.random() * w,
      y: -20 - Math.random() * 100,
      size: 8 + Math.random() * 12,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: 0.3 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.15 + Math.random() * 0.25,
      hue: 90 + Math.random() * 40,
      swayAmplitude: 20 + Math.random() * 30,
      swaySpeed: 0.005 + Math.random() * 0.01,
      swayOffset: Math.random() * Math.PI * 2
    }
  }

  function drawLeaf(leaf) {
    ctx.save()
    ctx.translate(leaf.x, leaf.y)
    ctx.rotate(leaf.rotation)
    ctx.globalAlpha = leaf.opacity

    ctx.fillStyle = `hsl(${leaf.hue}, 45%, 50%)`
    ctx.beginPath()
    ctx.moveTo(0, -leaf.size)
    ctx.bezierCurveTo(
      leaf.size * 0.6, -leaf.size * 0.6,
      leaf.size * 0.6, leaf.size * 0.6,
      0, leaf.size
    )
    ctx.bezierCurveTo(
      -leaf.size * 0.6, leaf.size * 0.6,
      -leaf.size * 0.6, -leaf.size * 0.6,
      0, -leaf.size
    )
    ctx.fill()

    ctx.strokeStyle = `hsl(${leaf.hue}, 45%, 40%)`
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, -leaf.size * 0.8)
    ctx.lineTo(0, leaf.size * 0.8)
    ctx.stroke()

    ctx.restore()
  }

  function animate() {
    if (!ctx) return
    const canvas = canvasRef.value
    if (!canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const time = Date.now()
    leaves.forEach((leaf) => {
      leaf.x += leaf.speedX + Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * 0.3
      leaf.y += leaf.speedY
      leaf.rotation += leaf.rotationSpeed

      if (leaf.y > canvas.height + 30 || leaf.x < -30 || leaf.x > canvas.width + 30) {
        leaf.y = -20 - Math.random() * 60
        leaf.x = Math.random() * canvas.width
      }

      drawLeaf(leaf)
    })

    animationId = requestAnimationFrame(animate)
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  function start() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const canvas = canvasRef.value
    if (!canvas) return

    ctx = canvas.getContext('2d')
    resize()

    for (let i = 0; i < leafCount; i++) {
      const leaf = createLeaf(canvas.width, canvas.height)
      leaf.y = Math.random() * canvas.height
      leaves.push(leaf)
    }

    animate()
  }

  onMounted(() => {
    start()
    window.addEventListener('resize', resize, { passive: true })
  })

  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', resize)
  })
}
