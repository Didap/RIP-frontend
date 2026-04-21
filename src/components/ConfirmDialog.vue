<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { IconAlertTriangle } from '@tabler/icons-vue'

const props = defineProps<{
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}>()

const emit = defineEmits(['update:open', 'confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2 text-destructive">
          <IconAlertTriangle v-if="confirmVariant === 'destructive'" class="w-5 h-5" />
          {{ title || 'Conferma' }}
        </DialogTitle>
        <DialogDescription class="pt-2">
          {{ description || 'Sei sicuro di voler procedere con questa operazione?' }}
        </DialogDescription>
      </DialogHeader>
      
      <DialogFooter class="sm:justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          @click="handleCancel"
        >
          {{ cancelText || 'Annulla' }}
        </Button>
        <Button
          type="button"
          :variant="confirmVariant || 'default'"
          @click="handleConfirm"
        >
          {{ confirmText || 'Conferma' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
