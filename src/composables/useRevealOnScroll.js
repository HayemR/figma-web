import { onBeforeUnmount, onMounted } from 'vue'
import gsap from 'gsap'

/**
 * Simple section reveal on scroll.
 * Usage: const { register } = useRevealOnScroll(); then in template: ref="register" on a section root.
 */
export function useRevealOnScroll(options = {}) {
  const { y = 18, duration = 0.8, ease = 'power3.out', threshold = 0.2, once = true } = options

  const elements = new Set()
  let io = null

  const reveal = (el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration, ease, clearProps: 'transform' },
    )
  }

  const register = (el) => {
    if (!el) return
    elements.add(el)
    io?.observe(el)
  }

  onMounted(() => {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          reveal(entry.target)
          if (once) io.unobserve(entry.target)
        }
      },
      { threshold },
    )

    for (const el of elements) io.observe(el)
  })

  onBeforeUnmount(() => {
    if (io) io.disconnect()
    io = null
    elements.clear()
  })

  return { register }
}
