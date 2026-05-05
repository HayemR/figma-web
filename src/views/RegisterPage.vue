<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const onSubmit = async () => {
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  isSubmitting.value = true

  try {
    const res = await fetch(`${apiBase}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data?.detail || 'Registration failed')

    success.value = `Account created for ${data.user.username}`
    setTimeout(() => router.push('/login'), 900)
  } catch (err) {
    error.value = err?.message || 'Registration failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-hero">
    <NavBar />

    <section class="mx-auto max-w-4xl px-4 pb-16 pt-10">
      <div class="rounded-[2rem] bg-panel p-8 ring-1 ring-white/10">
        <p class="text-xs uppercase tracking-[0.3em] text-white/50">Create account</p>
        <h1 class="mt-3 text-4xl font-extrabold tracking-tight">Join the Neonrig crew</h1>
        <p class="mt-4 text-white/70">
          Create an account to keep your builds in sync and speed through checkout.
        </p>

        <form class="mt-8 grid gap-5 md:grid-cols-2" @submit.prevent="onSubmit">
          <div class="md:col-span-2">
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
              autocomplete="new-password"
              class="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label class="text-sm text-white/70">Confirm password</label>
            <input
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              class="mt-2 w-full rounded-xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              placeholder="Repeat password"
            />
          </div>

          <div
            v-if="error"
            class="md:col-span-2 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200"
          >
            {{ error }}
          </div>
          <div
            v-if="success"
            class="md:col-span-2 rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200"
          >
            {{ success }}
          </div>

          <button
            type="submit"
            class="md:col-span-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 font-semibold text-black shadow-glow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <button
          class="mt-6 text-sm text-white/70 underline-offset-4 hover:underline"
          @click="router.push('/login')"
        >
          Already have an account? Sign in
        </button>
      </div>
    </section>
  </div>
</template>
