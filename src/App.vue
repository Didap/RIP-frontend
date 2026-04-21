<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from '@/lib/auth'
import { Toaster } from '@/components/ui/toast'

const { isAuthenticated, fetchCurrentUser } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    fetchCurrentUser()
  }
})
</script>

<template>
  <RouterView />
  <Toaster />
</template>

<style scoped></style>
