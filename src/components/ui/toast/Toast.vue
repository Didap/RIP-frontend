<script setup lang="ts">
import { IconCheck, IconX, IconAlertCircle, IconInfoCircle } from '@tabler/icons-vue'

const props = defineProps<{
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}>()

const emit = defineEmits<{
  close: [id: number]
}>()

const icons = {
  success: IconCheck,
  error: IconAlertCircle,
  info: IconInfoCircle,
}

const colors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconColors = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  info: 'text-blue-600',
}
</script>

<template>
  <div :class="['flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right-full duration-300', colors[type]]">
    <component :is="icons[type]" :class="['size-4 shrink-0', iconColors[type]]" />
    <span class="text-sm font-medium flex-1">{{ message }}</span>
    <button @click="emit('close', id)" class="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
      <IconX class="size-4" />
    </button>
  </div>
</template>
