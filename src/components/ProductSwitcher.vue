<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import ArrowSwitchButton from '@/components/ArrowSwitchButton.vue'

const props = defineProps({
  featured: { type: Array, default: () => [] },
})

const index = ref(0)
const active = computed(() => props.featured[index.value] || null)

const titleRef = ref(null)
const imageRef = ref(null)

const animateIn = () => {
  if (!titleRef.value || !imageRef.value) return
  gsap.fromTo(
    titleRef.value,
    { x: -24, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
  )
  gsap.fromTo(
    imageRef.value,
    { y: 16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
  )
}

const swap = async () => {
  if (!titleRef.value || !imageRef.value) {
    index.value = (index.value + 1) % Math.max(props.featured.length, 1)
    return
  }

  const dir = index.value === 0 ? 1 : -1

  await gsap
    .timeline()
    .to([titleRef.value, imageRef.value], {
      x: -10 * dir,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      stagger: 0.05,
    })
    .call(() => {
      index.value = (index.value + 1) % props.featured.length
    })
  await nextTick()
  gsap.to([titleRef.value, imageRef.value], {
    x: 0,
    opacity: 1,
    duration: 0.55,
    ease: 'power3.out',
    stagger: 0.05,
  })
}

onMounted(() => {
  animateIn()
})

watch(
  () => props.featured,
  () => {
    index.value = 0
    nextTick().then(animateIn)
  },
)
</script>

<template>
  <div class="relative">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div class="space-y-6">
        <div
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/80 ring-1 ring-white/10"
        >
          <span class="h-2 w-2 rounded-full bg-cyan-400 shadow-glow" />
          Featured Build
        </div>

        <h1 ref="titleRef" class="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
          <span
            class="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-purple-200 bg-clip-text text-transparent"
          >
            {{ active?.name || 'Quantum Reaper' }}
          </span>
        </h1>

        <p class="max-w-xl text-white/75">
          {{
            active?.overview ||
            'A neon-tuned gaming rig engineered for elite framerates, whisper-quiet cooling, and unreal RGB ambiance.'
          }}
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <button
            class="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 font-semibold text-black shadow-glow hover:brightness-110"
          >
            Buy Now
          </button>
          <button
            class="rounded-xl bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
            @click="$emit('go-collection')"
          >
            Our Collection
          </button>
        </div>

        <div class="flex items-center gap-3 pt-2 text-white/70">
          <a
            class="rounded-xl bg-white/10 p-2 ring-1 ring-white/15 hover:bg-white/15"
            href="#"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
              <path d="M17.5 6.5h.01" />
            </svg>
          </a>
          <a
            class="rounded-xl bg-white/10 p-2 ring-1 ring-white/15 hover:bg-white/15"
            href="#"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
              />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      </div>

      <div class="relative">
        <div class="absolute -inset-10 rounded-[2rem] bg-soft blur-2xl" />
        <img
          ref="imageRef"
          :src="active?.image"
          :alt="active?.name"
          class="relative mx-auto w-full max-w-lg select-none rounded-[2rem] object-cover shadow-glowStrong ring-1 ring-white/10 animate-floaty"
          draggable="false"
        />
      </div>
    </div>

    <ArrowSwitchButton @click="swap" />
  </div>
</template>
