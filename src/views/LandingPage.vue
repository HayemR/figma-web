<script setup>
import { onMounted, ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import LandingHero from '@/components/LandingHero.vue'
import CollectionGrid from '@/components/CollectionGrid.vue'
import ProductDetail from '@/components/ProductDetail.vue'
import { products, featuredProducts } from '@/data/products.js'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll.js'
import { useCart } from '@/composables/useCart.js'

const selectedProductId = ref(null)
const selectedProduct = computed(() => {
  if (!selectedProductId.value) return null
  return products.find((p) => p.id === selectedProductId.value) || null
})

const { register: revealSection } = useRevealOnScroll({ y: 22, duration: 0.9 })

const {
  items: cartItems,
  subtotal: cartSubtotal,
  addToCart,
  removeFromCart,
  setQty,
  clearCart,
} = useCart()

onMounted(() => {
  // Cart is an in-page section (no drawer). Nothing to close here.
})

const onSelectProduct = async (product) => {
  selectedProductId.value = product?.id ?? null
  // allow DOM to render
  await Promise.resolve()
  const el = document.getElementById('detail')
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const onAddToCart = async (product) => {
  addToCart(product, 1)
  // dev sanity check (remove later if you want)
  console.log('[LandingPage] added to cart:', product?.name)

  await Promise.resolve()
  const el = document.getElementById('cart')
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="min-h-screen bg-hero">
    <!-- Tailwind debug: if Tailwind is working this badge is gradient + rounded -->
    <div class="fixed bottom-4 left-4 z-[9999]">
      <div
        class="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-black shadow-glow"
      >
        Tailwind OK
      </div>
    </div>

    <NavBar />

    <section
      id="home"
      ref="revealSection"
      class="relative min-h-[calc(100vh-88px)] flex items-center"
    >
      <LandingHero
        :featured="featuredProducts"
        @go-collection="
          () => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
        "
      />
    </section>

    <section id="collection" ref="revealSection" class="relative scroll-mt-24 pt-4 md:pt-10">
      <CollectionGrid :items="products" @select="onSelectProduct" @add-to-cart="onAddToCart" />
    </section>

    <section id="detail" ref="revealSection" class="relative scroll-mt-24 pb-10">
      <ProductDetail :product="selectedProduct" @add-to-cart="onAddToCart" />
    </section>

    <section id="cart" ref="revealSection" class="relative scroll-mt-24 pb-16">
      <div class="mx-auto max-w-6xl px-4">
        <div class="overflow-hidden rounded-[2rem] bg-white/5 ring-1 ring-white/10">
          <div class="border-b border-white/10 p-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div class="text-xs text-white/60">My Cart</div>
                <h2 class="mt-1 text-2xl font-extrabold">Your selected builds</h2>
                <p class="mt-1 text-sm text-white/70">Items stay saved on this device.</p>
              </div>
              <button
                v-if="cartItems.length"
                class="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
                @click="clearCart()"
              >
                Clear cart
              </button>
            </div>
          </div>

          <div class="p-6">
            <div
              v-if="!cartItems.length"
              class="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 text-white/70"
            >
              Your cart is empty.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="it in cartItems"
                :key="it.id"
                class="flex flex-col gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:flex-row sm:items-center"
              >
                <div class="flex items-center gap-4">
                  <img
                    :src="it.image"
                    :alt="it.name"
                    class="h-16 w-16 rounded-xl bg-white/5 object-contain"
                  />
                  <div class="min-w-0">
                    <div class="truncate font-semibold">{{ it.name }}</div>
                    <div class="text-sm text-white/60">${{ it.price }} / unit</div>
                  </div>
                </div>

                <div class="flex flex-1 items-center justify-between gap-3 sm:justify-end">
                  <div class="flex items-center gap-2">
                    <button
                      class="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/15"
                      @click="setQty(it.id, Math.max(1, it.qty - 1))"
                    >
                      −
                    </button>
                    <input
                      class="h-9 w-16 rounded-xl bg-white/5 text-center text-sm ring-1 ring-white/10"
                      type="number"
                      min="1"
                      :value="it.qty"
                      @change="setQty(it.id, $event.target.value)"
                    />
                    <button
                      class="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/15"
                      @click="setQty(it.id, it.qty + 1)"
                    >
                      +
                    </button>
                  </div>

                  <div class="text-sm font-semibold">${{ (it.price * it.qty).toFixed(0) }}</div>

                  <button
                    class="rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
                    @click="removeFromCart(it.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div class="mt-6 rounded-2xl bg-soft p-5 ring-1 ring-white/10">
                <div class="flex items-center justify-between text-white/70">
                  <div>Subtotal</div>
                  <div class="text-white font-semibold">${{ cartSubtotal.toFixed(0) }}</div>
                </div>
                <button
                  class="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-semibold text-black shadow-glow hover:brightness-110"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
