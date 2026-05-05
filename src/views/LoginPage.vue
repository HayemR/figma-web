<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

const username = ref('')
const password = ref('')
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const onSubmit = async () => {
  error.value = ''
  success.value = ''
  isSubmitting.value = true

  try {
    const res = await fetch(`${apiBase}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data?.detail || 'Login failed')

    localStorage.setItem('auth.user', JSON.stringify(data.user))
    localStorage.setItem('auth.token', data.token)
    window.dispatchEvent(new Event('auth:changed'))
    router.push('/')
  } catch (err) {
    error.value = err?.message || 'Login failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-hero">
    <NavBar />

    <section class="mx-auto max-w-5xl px-4 pb-16 pt-10">
      <div class="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div class="rounded-[2rem] bg-panel p-8 ring-1 ring-white/10">
          <p class="text-xs uppercase tracking-[0.3em] text-white/50">Welcome</p>
          <h1 class="mt-3 text-4xl font-extrabold tracking-tight">Sign in to Neonrig</h1>
          <p class="mt-4 text-white/70">
            Log in to manage your saved builds and continue where you left off.
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="onSubmit">
            <div>
              <label class="text-sm text-white/70">Username</label>
              <input
                v-model="username"
                type="text"
                autocomplete="username"
                class="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="neonpilot"
              />
            </div>
            <div>
              <label class="text-sm text-white/70">Password</label>
              <input
                v-model="password"
                type="password"
                autocomplete="current-password"
                class="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                placeholder="At least 8 characters"
              />
            </div>

            <div v-if="error" class="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
              {{ error }}
            </div>
            <div
              v-if="success"
              class="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200"
            >
              {{ success }}
            </div>

            <button
              type="submit"
              class="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-semibold text-black shadow-glow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>
        </div>

        <div class="rounded-[2rem] bg-white/5 p-8 ring-1 ring-white/10">
          <h2 class="text-2xl font-semibold">New here?</h2>
          <p class="mt-3 text-white/70">
            Create an account to save builds, track your collection, and unlock quicker checkout.
          </p>
          <button
            class="mt-6 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15"
            @click="router.push('/register')"
          >
            Create an account
          </button>
          <button
            class="mt-3 block text-sm text-white/70 underline-offset-4 hover:underline"
            @click="router.push('/')"
          >
            Back to home
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
