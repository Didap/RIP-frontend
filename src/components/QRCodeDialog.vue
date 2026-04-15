<script setup lang="ts">
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { IconDownload, IconShare, IconCopy, IconCheck, IconQrcode } from '@tabler/icons-vue'

const props = defineProps<{
  open: boolean
  memorial: any
}>()

const emit = defineEmits(['update:open'])

const copied = ref(false)

const memorialLink = computed(() => {
  const baseUrl = import.meta.env.VITE_WEBSITE_URL || 'https://memora.life'
  return props.memorial?.link || `${baseUrl}/memorial/${props.memorial?.slug || ''}`
})

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(memorialLink.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

function downloadQRCode() {
  const canvas = document.querySelector('.qr-container canvas') as HTMLCanvasElement
  if (!canvas) return

  const link = document.createElement('a')
  link.download = `QR_${props.memorial?.slug || 'memorial'}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
      <DialogHeader class="p-6 bg-primary text-primary-foreground">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/10 rounded-lg">
             <IconQrcode class="size-6" />
          </div>
          <div>
            <DialogTitle class="text-xl">Generatore QR Code</DialogTitle>
            <DialogDescription class="text-primary-foreground/70">
              Scolpisci l'accesso digitale per {{ memorial?.full_name }}.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div v-if="memorial" class="p-8 flex flex-col items-center justify-center gap-6">
        <!-- QR Display -->
        <div class="qr-container p-6 bg-white rounded-3xl shadow-inner border-8 border-muted/20 flex items-center justify-center">
          <QrcodeVue 
            :value="memorialLink" 
            :size="240" 
            level="H" 
            render-as="canvas"
            foreground="#0f172a"
          />
        </div>

        <!-- Info / Link -->
        <div class="w-full space-y-2">
          <p class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">
            Link Destinazione
          </p>
          <div class="flex items-center gap-2 p-1.5 pl-4 bg-muted/30 rounded-full border border-border/50">
            <span class="text-xs font-medium truncate flex-1 text-muted-foreground">{{ memorialLink }}</span>
            <Button variant="ghost" size="icon" class="size-8 rounded-full" @click="copyToClipboard">
              <IconCheck v-if="copied" class="size-4 text-emerald-500" />
              <IconCopy v-else class="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <div v-else class="p-12 flex flex-col items-center justify-center text-center gap-4">
        <IconQrcode class="size-12 text-muted-foreground/20 animate-pulse" />
        <p class="text-sm text-muted-foreground">Caricamento dati memoriale...</p>
      </div>

      <DialogFooter class="p-6 bg-muted/20 border-t border-border/50 flex sm:justify-center gap-3">
        <Button variant="outline" class="flex-1 gap-2" @click="downloadQRCode">
          <IconDownload class="size-4" /> Scarica PNG
        </Button>
        <Button class="flex-1 gap-2">
          <IconShare class="size-4" /> Condividi
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.qr-container {
  background: white;
  transition: transform 0.3s ease;
}
.qr-container:hover {
  transform: scale(1.02);
}
</style>
