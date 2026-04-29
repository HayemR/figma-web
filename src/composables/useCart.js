import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'neonrig_cart_v1'

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json)
    return v ?? fallback
  } catch {
    return fallback
  }
}

// items: { id, name, price, image, qty }
const items = ref([])

// hydrate once
const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
items.value = raw ? safeParse(raw, []) : []

watch(
  items,
  (val) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true },
)

export function useCart() {
  const count = computed(() => items.value.reduce((sum, it) => sum + (it.qty || 0), 0))
  const subtotal = computed(() =>
    items.value.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 0), 0),
  )

  const addToCart = (product, qty = 1) => {
    if (!product) return
    const id = product.id
    const existing = items.value.find((x) => x.id === id)
    if (existing) existing.qty += qty
    else
      items.value.push({
        id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      })
  }

  const removeFromCart = (id) => {
    items.value = items.value.filter((x) => x.id !== id)
  }

  const setQty = (id, qty) => {
    const it = items.value.find((x) => x.id === id)
    if (!it) return
    const q = Math.max(1, Number(qty) || 1)
    it.qty = q
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    count,
    subtotal,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
  }
}
