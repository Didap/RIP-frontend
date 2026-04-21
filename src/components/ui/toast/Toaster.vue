<script setup lang="ts">
import Toast from './Toast.vue'
import { useToast } from '@/lib/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :id="toast.id"
      :message="toast.message"
      :type="toast.type"
      @close="removeToast"
    />
  </div>
</template>
