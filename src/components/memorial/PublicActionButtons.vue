<script setup lang="ts">
import { ref } from 'vue'
import { postPublicContribution } from '@/lib/public-api'

const props = defineProps<{
  slug: string
  stats: { flowers: number; candles: number; memories: number }
  publicUrl: string
}>()

const emit = defineEmits<{
  contribution: []
}>()

const submittingFlower = ref(false)
const submittingCandle = ref(false)
const copied = ref(false)
const showSuccess = ref<string | null>(null)

async function leaveFlower() {
  if (submittingFlower.value) return
  submittingFlower.value = true
  try {
    await postPublicContribution(props.slug, 'flower')
    showSuccess.value = 'flower'
    emit('contribution')
    setTimeout(() => { showSuccess.value = null }, 2000)
  } catch {
    // silently fail
  } finally {
    submittingFlower.value = false
  }
}

async function leaveCandle() {
  if (submittingCandle.value) return
  submittingCandle.value = true
  try {
    await postPublicContribution(props.slug, 'candle')
    showSuccess.value = 'candle'
    emit('contribution')
    setTimeout(() => { showSuccess.value = null }, 2000)
  } catch {
    // silently fail
  } finally {
    submittingCandle.value = false
  }
}

async function share() {
  const shareData = {
    title: 'RIP',
    text: 'Visita questo memoriale digitale',
    url: props.publicUrl,
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return
    } catch {
      // user cancelled or error, fallback to copy
    }
  }
  await copyLink()
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.publicUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback: select text
  }
}

function openInApp() {
  window.location.href = `ripapp://memorial/${props.slug}`
}
</script>

<template>
  <div class="action-bar">
    <div class="action-bar-inner">
      <button
        class="action-btn flower-btn"
        :disabled="submittingFlower"
        @click="leaveFlower"
      >
        <span v-if="showSuccess === 'flower'" class="success-check">&#10003;</span>
        <span v-else class="action-icon">&#127800;</span>
        <span class="action-label">Fiore</span>
      </button>

      <button
        class="action-btn candle-btn"
        :disabled="submittingCandle"
        @click="leaveCandle"
      >
        <span v-if="showSuccess === 'candle'" class="success-check">&#10003;</span>
        <span v-else class="action-icon">&#128367;</span>
        <span class="action-label">Candela</span>
      </button>

      <button class="action-btn share-btn" @click="share">
        <span class="action-icon">{{ copied ? '&#10003;' : '&#8599;' }}</span>
        <span class="action-label">{{ copied ? 'Copiato' : 'Condividi' }}</span>
      </button>

      <button class="action-btn app-btn" @click="openInApp">
        <span class="action-icon">&#128241;</span>
        <span class="action-label">App</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid #E5E7EB;
  padding: 0.5rem 1rem;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  z-index: 50;
}

.action-bar-inner {
  display: flex;
  justify-content: space-around;
  max-width: 480px;
  margin: 0 auto;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: background 0.15s;
  font-family: system-ui, -apple-system, sans-serif;
}

.action-btn:hover {
  background: #F3F4F6;
}

.action-btn:active {
  background: #E5E7EB;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-icon {
  font-size: 1.35rem;
  line-height: 1;
}

.action-label {
  font-size: 0.65rem;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 500;
}

.success-check {
  font-size: 1.35rem;
  color: #10B981;
  line-height: 1;
}
</style>
