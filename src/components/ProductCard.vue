<script setup>
const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['select', 'add-to-cart'])
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/7 hover:shadow-glow"
  >
    <div
      class="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15"
    >
      {{ item.tag || 'NEW' }}
    </div>

    <img :src="item.image" :alt="item.name" class="h-52 w-full object-cover" />

    <div class="space-y-3 p-5">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ item.name }}</h3>
        <div class="text-sm text-white/70">★ {{ item.rating }}</div>
      </div>
      <div class="text-white/70">
        Starting at <span class="text-white font-semibold">${{ item.price }}</span>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
          @click="emit('add-to-cart', item)"
        >
          Buy
        </button>
        <button
          class="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
          @click="emit('select', item)"
        >
          Details
        </button>
      </div>
    </div>
  </div>
</template>
