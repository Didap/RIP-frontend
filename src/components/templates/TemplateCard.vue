<script setup lang="ts">
defineProps<{
  template: 'classic' | 'elegant' | 'modern'
  selected: boolean
}>()

defineEmits<{
  select: [template: 'classic' | 'elegant' | 'modern']
}>()

const labels: Record<string, string> = {
  classic: 'Classico',
  elegant: 'Elegante',
  modern: 'Moderno',
}

const descriptions: Record<string, string> = {
  classic: 'Tono caldo, tradizionale e reverente',
  elegant: 'Minimal, raffinato con copertina immersiva',
  modern: 'Bold, contemporaneo con layout a griglia',
}
</script>

<template>
  <button
    class="template-card"
    :class="{ selected, [`theme-${template}`]: true }"
    @click="$emit('select', template)"
  >
    <div class="template-preview">
      <!-- Classic mini preview -->
      <div v-if="template === 'classic'" class="mini-classic">
        <div class="mc-photo"></div>
        <div class="mc-line mc-line-name"></div>
        <div class="mc-line mc-line-sub"></div>
        <div class="mc-divider"></div>
        <div class="mc-section"></div>
        <div class="mc-stats">
          <div class="mc-dot"></div>
          <div class="mc-dot"></div>
          <div class="mc-dot"></div>
        </div>
      </div>

      <!-- Elegant mini preview -->
      <div v-if="template === 'elegant'" class="mini-elegant">
        <div class="me-cover"></div>
        <div class="me-profile"></div>
        <div class="me-line me-line-dates"></div>
        <div class="me-bar"></div>
        <div class="me-section"></div>
      </div>

      <!-- Modern mini preview -->
      <div v-if="template === 'modern'" class="mini-modern">
        <div class="mm-header">
          <div class="mm-avatar"></div>
          <div class="mm-lines">
            <div class="mm-line mm-line-name"></div>
            <div class="mm-line mm-line-sub"></div>
          </div>
        </div>
        <div class="mm-badge"></div>
        <div class="mm-chips">
          <div class="mm-chip"></div>
          <div class="mm-chip"></div>
        </div>
        <div class="mm-grid">
          <div class="mm-col-left"></div>
          <div class="mm-col-right"></div>
        </div>
      </div>
    </div>

    <div class="template-label">
      <span class="template-name">{{ labels[template] }}</span>
      <span class="template-desc">{{ descriptions[template] }}</span>
    </div>

    <div v-if="selected" class="check-badge">✓</div>
  </button>
</template>

<style scoped>
.template-card {
  position: relative;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  text-align: left;
  padding: 0;
}

.template-card:hover {
  border-color: #9CA3AF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.template-card.selected {
  border-color: #0a7ea4;
  box-shadow: 0 0 0 2px rgba(10, 126, 164, 0.2);
}

.template-preview {
  height: 180px;
  padding: 12px;
  overflow: hidden;
}

.theme-classic .template-preview {
  background: linear-gradient(180deg, #FAFAF9, #F5F5F4);
}

.theme-elegant .template-preview {
  background: #FFFFFF;
}

.theme-modern .template-preview {
  background: #FFFFFF;
}

.template-label {
  padding: 0.75rem 0.75rem;
  border-top: 1px solid #F3F4F6;
}

.template-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

.template-desc {
  display: block;
  font-size: 0.7rem;
  color: #9CA3AF;
  margin-top: 0.15rem;
}

.check-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  background: #0a7ea4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

/* Classic mini */
.mini-classic {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
}

.mc-photo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #B8860B;
  background: #E5E7EB;
}

.mc-line {
  height: 6px;
  background: #D1D5DB;
  border-radius: 3px;
}

.mc-line-name {
  width: 80px;
  height: 8px;
  background: #9CA3AF;
  border-radius: 4px;
}

.mc-line-sub {
  width: 100px;
}

.mc-divider {
  width: 30px;
  height: 2px;
  background: #B8860B;
  margin: 2px 0;
}

.mc-section {
  width: 90%;
  height: 30px;
  background: #F3F4F6;
  border-radius: 6px;
  border-top: 2px solid #B8860B;
}

.mc-stats {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.mc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #D1D5DB;
}

/* Elegant mini */
.mini-elegant {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.me-cover {
  height: 60px;
  background: linear-gradient(135deg, #1E293B, #334155);
  border-radius: 8px 8px 0 0;
  position: relative;
}

.me-profile {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #E2E8F0;
  border: 2px solid white;
  margin: -18px auto 0;
  position: relative;
}

.me-line {
  height: 5px;
  background: #CBD5E1;
  border-radius: 3px;
  margin: 0 auto;
}

.me-line-dates {
  width: 80px;
  margin-top: 8px;
}

.me-bar {
  width: 85%;
  height: 18px;
  background: rgba(241, 245, 249, 0.8);
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  margin: 10px auto;
}

.me-section {
  width: 85%;
  height: 40px;
  background: #F8FAFC;
  border-radius: 6px;
  border-left: 2px solid #1E293B;
  margin: 0 auto;
}

/* Modern mini */
.mini-modern {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mm-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mm-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #F1F5F9;
  flex-shrink: 0;
}

.mm-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mm-line {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
}

.mm-line-name {
  width: 70%;
  height: 8px;
  background: #475569;
}

.mm-line-sub {
  width: 50%;
}

.mm-badge {
  width: 50%;
  height: 14px;
  background: #10B981;
  border-radius: 10px;
  margin-left: 4px;
}

.mm-chips {
  display: flex;
  gap: 4px;
  margin-left: 4px;
}

.mm-chip {
  width: 40px;
  height: 12px;
  background: #F8FAFC;
  border-radius: 4px;
}

.mm-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-top: 4px;
}

.mm-col-left {
  background: #F8FAFC;
  border-radius: 8px;
}

.mm-col-right {
  background: #F8FAFC;
  border-radius: 8px;
}
</style>
