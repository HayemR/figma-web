<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  open: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  subtotal: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'remove', 'set-qty', 'clear'])

const debugClose = () => {
  console.log('[CartDrawer] close clicked')
  emit('close')
}

const formattedSubtotal = computed(() => `$${Number(props.subtotal || 0).toFixed(0)}`)

const animateOpen = async () => {
  await nextTick()

  const overlay = document.getElementById('cart-overlay')
  const panel = document.getElementById('cart-panel')
  if (!overlay || !panel) return

  gsap.killTweensOf([overlay, panel])

  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
  gsap.fromTo(
    panel,
    { x: 32, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
  )
}

watch(
  () => props.open,
  (v) => {
    if (v) animateOpen()
  },
)

const onOverlayClick = (e) => {
  console.log('[CartDrawer] overlay click target:', e.target?.id)
  // close only when clicking the overlay itself (not inside the panel)
  if (e.target?.id === 'cart-overlay') emit('close')
}

const onKeyDown = (e) => {
  if (!props.open) return
  if (e.key === 'Escape') {
    console.log('[CartDrawer] ESC close')
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <teleport to="body">
    <div v-if="!!open" id="cart-overlay" class="fixed inset-0 z-[60]" @click="onOverlayClick">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      <aside
        id="cart-panel"
        class="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#070A12]/90 p-5 text-white"
        @click.stop
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-xs text-white/60">My Cart</div>
            <h3 class="mt-1 text-2xl font-extrabold">Ready to checkout?</h3>
          </div>
          <button
            class="rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15 hover:bg-white/15"
            @click="debugClose"
          >
            Close
          </button>
        </div>

        <div
          v-if="!items.length"
          class="mt-8 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 text-white/70"
        >
          Your cart is empty.
        </div>

        <div v-else class="mt-6 space-y-4">
          <div
            v-for="it in items"
            :key="it.id"
            class="flex gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
          >
            <img
              :src="it.image"
              :alt="it.name"
              class="h-16 w-16 rounded-xl bg-white/5 object-contain"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div class="truncate font-semibold">{{ it.name }}</div>
                <button
                  class="text-sm text-white/60 hover:text-white"
                  @click="emit('remove', it.id)"
                >
                  Remove
                </button>
              </div>
              <div class="mt-1 text-sm text-white/60">${{ it.price }} / unit</div>

              <div class="mt-3 flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <button
                    class="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/15"
                    @click="emit('set-qty', it.id, Math.max(1, it.qty - 1))"
                  >
                    −
                  </button>
                  <input
                    class="h-9 w-14 rounded-xl bg-white/5 text-center text-sm ring-1 ring-white/10"
                    type="number"
                    min="1"
                    :value="it.qty"
                    @change="emit('set-qty', it.id, $event.target.value)"
                  />
                  <button
                    class="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/15"
                    @click="emit('set-qty', it.id, it.qty + 1)"
                  >
                    +
                  </button>
                </div>

                <div class="text-sm font-semibold">${{ (it.price * it.qty).toFixed(0) }}</div>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-2xl bg-soft p-5 ring-1 ring-white/10">
            <div class="flex items-center justify-between text-white/70">
              <div>Subtotal</div>
              <div class="text-white font-semibold">{{ formattedSubtotal }}</div>
            </div>
            <button
              class="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-semibold text-black shadow-glow hover:brightness-110"
            >
              Checkout
            </button>
            <button
              class="mt-3 w-full rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
              @click="emit('clear')"
            >
              Clear cart
            </button>
          </div>
        </div>
      </aside>
    </div>
  </teleport>
</template>
