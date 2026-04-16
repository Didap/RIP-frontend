<script setup lang="ts">
import { computed } from 'vue'
import ClassicTemplate from './ClassicTemplate.vue'
import ElegantTemplate from './ElegantTemplate.vue'
import ModernTemplate from './ModernTemplate.vue'
import type { MemorialData } from './types'

const props = defineProps<{ memorial: MemorialData; preview?: boolean }>()

const component = computed(() => {
  switch (props.memorial.template) {
    case 'elegant': return ElegantTemplate
    case 'modern': return ModernTemplate
    default: return ClassicTemplate
  }
})
</script>

<template>
  <component :is="component" :memorial="memorial" :preview="preview" />
</template>
