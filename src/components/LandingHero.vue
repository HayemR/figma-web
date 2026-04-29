<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ProductSwitcher from '@/components/ProductSwitcher.vue'

defineProps({
  featured: { type: Array, default: () => [] },
})

defineEmits(['go-collection'])

const root = ref(null)

onMounted(() => {
  if (!root.value) return
  const nodes = root.value.querySelectorAll('[data-hero]')
  gsap.fromTo(
    nodes,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
  )
})
</script>

<template>
  <div ref="root" class="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 md:pt-10">
    <div
      class="relative overflow-hidden rounded-[2.25rem] bg-[image:var(--tw-background-image)] bg-panel ring-1 ring-white/10 p-6 md:p-10"
      data-hero
    >
      <div class="pointer-events-none absolute inset-0 opacity-90">
        <div class="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
        <div class="absolute -right-28 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div
          class="absolute -bottom-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"
        />
      </div>

      <div class="relative">
        <ProductSwitcher :featured="featured" @go-collection="$emit('go-collection')" />
      </div>

      <div class="mt-10 flex items-center justify-between text-xs text-white/65" data-hero>
        <div>Built for esports. Tuned for creators. Crafted for you.</div>
        <button
          class="rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/15"
          @click="$emit('go-collection')"
        >
          Scroll to Collection
        </button>
      </div>
    </div>
  </div>
</template>
