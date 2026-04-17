<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'Pagina non trovata — RIP',
})
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="not-found-icon">&#10024;</div>
      <h1>404</h1>
      <p>La pagina che stai cercando non esiste.</p>
      <a href="/" class="back-link">Torna alla homepage</a>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  background: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
}

.not-found-content {
  text-align: center;
  padding: 2rem;
}

.not-found-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

p {
  color: #6B7280;
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-block;
  padding: 0.625rem 1.5rem;
  background: #111827;
  color: #ffffff;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background 0.15s;
}

.back-link:hover {
  background: #374151;
}
</style>
