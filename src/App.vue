<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from '@/lib/auth'

const { isAuthenticated, fetchCurrentUser } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    fetchCurrentUser()
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
