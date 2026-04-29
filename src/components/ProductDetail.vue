<script setup>
import { computed, nextTick, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  product: { type: Object, default: null },
})

const emit = defineEmits(['add-to-cart'])

const hasProduct = computed(() => !!props.product)

const animateOpen = async () => {
  await nextTick()
  const panel = document.getElementById('product-detail-panel')
  if (!panel) return
  gsap.fromTo(panel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })

  const img = panel.querySelector('[data-hero-img]')
  const left = panel.querySelector('[data-left]')
  if (img)
    gsap.fromTo(
      img,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' },
    )
  if (left)
    gsap.fromTo(
      left,
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
    )
}

watch(
  () => props.product,
  (val) => {
    if (val) animateOpen()
  },
)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4">
    <div v-if="!hasProduct" class="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 text-white/70">
      Select a PC from the collection to see full details here.
    </div>

    <div
      v-else
      id="product-detail-panel"
      class="overflow-hidden rounded-[2rem] bg-white/5 ring-1 ring-white/10"
    >
      <div class="grid gap-8 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
        <div data-left class="space-y-5">
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/80 ring-1 ring-white/10"
          >
            <span class="h-2 w-2 rounded-full bg-fuchsia-400 shadow-glow" />
            Item Detail
          </div>

          <h3 class="text-4xl font-extrabold">{{ product.name }}</h3>
          <div class="flex items-center gap-3 text-white/70">
            <div>★ {{ product.rating }}</div>
            <div class="h-1 w-1 rounded-full bg-white/30" />
            <div>
              Starting at <span class="text-white font-semibold">${{ product.price }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-xl bg-white/10 px-5 py-3 font-semibold ring-1 ring-white/15 hover:bg-white/15"
            >
              Customize This PC
            </button>
            <button
              class="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-semibold text-black shadow-glow hover:brightness-110"
              @click="emit('add-to-cart', product)"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-8 rounded-[2rem] bg-soft blur-2xl" />
          <img
            data-hero-img
            :src="product.image"
            :alt="product.name"
            class="relative mx-auto w-full max-w-xl rounded-[2rem] object-cover shadow-glowStrong ring-1 ring-white/10"
          />
        </div>
      </div>

      <div class="border-t border-white/10 p-6 md:p-10">
        <div class="grid gap-8 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <div class="text-sm text-white/60">Model: {{ product.model }}</div>
            <h4 class="mt-2 text-2xl font-bold">Overview</h4>
            <p class="mt-2 text-white/70">
              {{ product.overview }}
            </p>
          </div>

          <div class="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <h4 class="text-lg font-bold">Specifications</h4>
            <ul class="mt-3 space-y-2 text-sm text-white/75">
              <li
                v-for="(v, k) in product.specs"
                :key="k"
                class="flex items-center justify-between gap-4"
              >
                <span class="text-white/60 capitalize">{{ k }}</span>
                <span class="text-right">{{ v }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
