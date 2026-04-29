<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import ProductCard from '@/components/ProductCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['select', 'add-to-cart'])

const root = ref(null)

onMounted(() => {
  if (!root.value) return
  const cards = root.value.querySelectorAll('[data-card]')
  gsap.fromTo(
    cards,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 },
  )
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 pb-20" ref="root">
    <div class="mb-8 rounded-2xl bg-soft p-6 ring-1 ring-white/10">
      <div class="flex items-end justify-between gap-6">
        <div>
          <h2 class="text-3xl font-extrabold">Our Collection</h2>
          <p class="mt-2 max-w-2xl text-white/70">
            Pick a base build, then customize everything. Each rig is tuned for thermals, acoustics,
            and neon-level style.
          </p>
        </div>
        <div class="hidden md:block text-sm text-white/60">3 / row • 2 / tablet • 1 / mobile</div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="it in items" :key="it.id" data-card>
        <ProductCard
          :item="it"
          @select="(p) => emit('select', p)"
          @add-to-cart="(p) => emit('add-to-cart', p)"
        />
      </div>
    </div>
  </div>
</template>
