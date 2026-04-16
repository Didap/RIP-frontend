<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'

defineProps<{
  steps: string[]
  currentStep: number // 1-indexed
}>()
</script>

<template>
  <div class="w-full relative py-4">
    <div class="relative flex justify-between w-full z-10">
      <!-- Background Line -->
      <div class="absolute left-0 top-[15px] w-full h-[2px] bg-muted -z-10"></div>
      
      <!-- Progress Line -->
      <div 
        class="absolute left-0 top-[15px] h-[2px] bg-primary transition-all duration-500 ease-in-out -z-10"
        :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
      ></div>
      
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="flex flex-col items-center gap-2 relative bg-background px-2"
      >
        <div 
          class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300"
          :class="[
            currentStep > index + 1 
              ? 'border-primary bg-primary text-primary-foreground' 
              : currentStep === index + 1 
                ? 'border-primary bg-background text-foreground ring-4 ring-primary/20' 
                : 'border-muted bg-background text-muted-foreground'
          ]"
        >
          <span v-if="currentStep <= index + 1" class="text-sm font-semibold">{{ index + 1 }}</span>
          <IconCheck v-else class="size-4" />
        </div>
        <span 
          class="text-xs font-medium transition-colors duration-300 absolute -bottom-6 whitespace-nowrap"
          :class="[
            currentStep >= index + 1 ? 'text-foreground' : 'text-muted-foreground'
          ]"
        >
          {{ step }}
        </span>
      </div>
    </div>
  </div>
</template>
