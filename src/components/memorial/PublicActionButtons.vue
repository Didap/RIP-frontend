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
const submittingMemory = ref(false)
const copied = ref(false)
const showSuccess = ref<string | null>(null)
const showMemoryInput = ref(false)
const memoryText = ref('')

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

async function submitMemory() {
  if (!memoryText.value.trim() || submittingMemory.value) return
  submittingMemory.value = true
  try {
    await postPublicContribution(props.slug, 'text', memoryText.value.trim())
    showSuccess.value = 'memory'
    emit('contribution')
    memoryText.value = ''
    showMemoryInput.value = false
    setTimeout(() => { showSuccess.value = null }, 2000)
  } catch {
    // silently fail
  } finally {
    submittingMemory.value = false
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
  <div class="action-bar-container">
    <!-- Memory Input Overlay -->
    <Transition name="slide-up">
      <div v-if="showMemoryInput" class="memory-input-overlay">
        <div class="memory-input-card">
          <div class="memory-header">
            <h3>Lascia un ricordo</h3>
            <button class="close-btn" @click="showMemoryInput = false">&times;</button>
          </div>
          <textarea
            v-model="memoryText"
            placeholder="Scrivi un pensiero, un ricordo o un messaggio..."
            maxlength="2000"
          ></textarea>
          <div class="memory-footer">
            <span class="char-count">{{ memoryText.length }}/2000</span>
            <button
              class="submit-btn"
              :disabled="!memoryText.trim() || submittingMemory"
              @click="submitMemory"
            >
              {{ submittingMemory ? 'Inviando...' : 'Invia ricordo' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

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

        <button
          class="action-btn memory-btn"
          @click="showMemoryInput = true"
        >
          <span v-if="showSuccess === 'memory'" class="success-check">&#10003;</span>
          <span v-else class="action-icon">&#128488;</span>
          <span class="action-label">Ricordo</span>
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
  </div>
</template>

<style scoped>
.action-bar-container {
  z-index: 100;
}

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
  padding: 0.5rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: background 0.15s;
  font-family: system-ui, -apple-system, sans-serif;
  min-width: 64px;
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

/* Memory Input */
.memory-input-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.memory-input-card {
  background: white;
  width: 100%;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.5rem;
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.1);
}

.memory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.memory-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: #F3F4F6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6B7280;
}

textarea {
  width: 100%;
  height: 150px;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  padding: 1rem;
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  margin-bottom: 1rem;
  outline: none;
  transition: border-color 0.15s;
}

textarea:focus {
  border-color: #3B82F6;
}

.memory-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 0.8rem;
  color: #9CA3AF;
}

.submit-btn {
  background: #111827;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
