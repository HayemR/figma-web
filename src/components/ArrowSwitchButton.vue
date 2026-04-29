<script setup>
const emit = defineEmits(['click'])
</script>

<template>
  <button
    class="group absolute bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur shadow-glow hover:bg-white/15"
    @click="emit('click')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 text-white/90 transition group-hover:translate-x-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </button>
</template>
