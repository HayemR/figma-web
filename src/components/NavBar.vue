<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()

const items = [
  { label: 'Home', to: '#home' },
  { label: 'Collections', to: '#collection' },
  { label: 'Newly Build', to: '#collection' },
  { label: 'My Cart', to: '#cart' },
]

const activeHash = ref('#home')
const linkRefs = ref([])

const setLinkRef = (el) => {
  if (!el) return
  // v-for will call this multiple times; keep unique refs only
  if (!linkRefs.value.includes(el)) linkRefs.value.push(el)
}

const indicatorStyle = computed(() => {
  const idx = items.findIndex((i) => i.to === activeHash.value)
  const el = linkRefs.value[idx]
  if (!el) return { opacity: 0 }

  // Use offsets inside the links container
  return {
    opacity: 1,
    width: `${el.offsetWidth}px`,
    transform: `translateX(${el.offsetLeft}px)`,
  }
})

let scrollTween = null
const animateScrollToEl = (el) => {
  if (!el) return

  // account for sticky navbar area / scroll-mt utilities
  const headerOffset = 96
  const y = window.scrollY + el.getBoundingClientRect().top - headerOffset

  // kill any in-flight scroll so clicks feel responsive
  scrollTween?.kill()

  scrollTween = gsap.to(window, {
    duration: 0.9,
    ease: 'power3.out',
    scrollTo: y,
    // fallback when ScrollToPlugin isn't registered
    onUpdate: () => {
      if (!gsap.plugins?.scrollTo) window.scrollTo(0, window.scrollY)
    },
  })

  // If ScrollToPlugin isn't present, do a manual tween of a number
  if (!gsap.plugins?.scrollTo) {
    scrollTween?.kill()
    const from = window.scrollY
    const to = y
    scrollTween = gsap.to(
      { v: from },
      {
        v: to,
        duration: 0.9,
        ease: 'power3.out',
        onUpdate() {
          window.scrollTo(0, this.targets()[0].v)
        },
      },
    )
  }
}

const scrollTo = (hash) => {
  activeHash.value = hash
  const id = hash.replace('#', '')
  const el = document.getElementById(id)
  if (el) animateScrollToEl(el)
  else router.push('/')
}

const updateActiveFromScroll = () => {
  const targets = items
    .map((i) => i.to.replace('#', ''))
    .map((id) => document.getElementById(id))
    .filter(Boolean)

  if (!targets.length) return

  // Pick the last section whose top is above a threshold
  const threshold = 140
  let current = targets[0]
  for (const t of targets) {
    if (t.getBoundingClientRect().top <= threshold) current = t
  }
  activeHash.value = `#${current.id}`
}

let raf = 0
const onScroll = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(updateActiveFromScroll)
}

let ro = null
onMounted(() => {
  updateActiveFromScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  // Keep indicator aligned on resize/font load
  ro = new ResizeObserver(() => updateActiveFromScroll())
  ro.observe(document.documentElement)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
  scrollTween?.kill()
  if (ro) ro.disconnect()
})
</script>

<template>
  <div class="sticky top-0 z-40">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <div class="glass neon-ring flex w-full items-center justify-between rounded-2xl px-5 py-3">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/15" />
          <div class="leading-tight">
            <div class="text-sm font-semibold tracking-wide">NEONRIG</div>
            <div class="text-xs text-white/60">Custom PCs</div>
          </div>
        </div>

        <div class="relative hidden items-center gap-6 md:flex" aria-label="Primary">
          <!-- sliding indicator -->
          <span
            class="pointer-events-none absolute -bottom-2 left-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 shadow-glow transition-[transform,width,opacity] duration-300 ease-out"
            :style="indicatorStyle"
          />

          <button
            v-for="it in items"
            :key="it.label"
            :ref="setLinkRef"
            class="relative text-sm text-white/75 transition hover:text-white"
            :class="{ 'text-white': activeHash === it.to }"
            @click="scrollTo(it.to)"
          >
            {{ it.label }}
          </button>
        </div>

        <div class="hidden items-center gap-3 md:flex">
          <button
            class="rounded-xl bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/15 hover:bg-white/15"
          >
            Login
          </button>
          <button
            class="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-black shadow-glow hover:brightness-110"
          >
            Sign Up
          </button>
        </div>

        <div class="md:hidden">
          <button class="rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
            <span class="sr-only">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>
