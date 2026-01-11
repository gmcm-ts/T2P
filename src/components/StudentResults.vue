<template>
  <div class="results-container">
    <div class="result-card main-result">
      <h3 class="department">{{ result.department }}</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Posting Site:</span>
          <span class="value">{{ result.site }}</span>
        </div>
        <div class="info-item">
          <span class="label">Today's Focus:</span>
          <span class="value">{{ result.task }}</span>
        </div>
      </div>
    </div>

    <div class="result-card">
      <h4 class="card-title">
        <Users :size="16" />
        Colleagues in this Posting
      </h4>
      <p class="colleagues">{{ colleagues }}</p>
    </div>

    <div class="result-card guideline-card">
      <h4 class="card-title">
        <Lightbulb :size="16" />
        Guideline of the Day
      </h4>
      <div class="guideline-content">
        <h5 class="guideline-title">{{ guideline.title }}</h5>
        <p class="guideline-text">{{ guideline.points.join(' ') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Users, Lightbulb } from 'lucide-vue-next'

defineProps({
  result: Object,
  colleagues: String,
  guideline: Object
})
</script>

<style scoped>
.results-container {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .results-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .results-container {
    grid-template-columns: 2fr 1fr;
  }
}

.result-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}

.main-result {
  grid-column: 1 / -1;
}

@media (min-width: 1024px) {
  .main-result {
    grid-column: 1 / 2;
  }
}

.guideline-card {
  grid-column: 1 / -1;
}

.department {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 16px 0;
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 14px;
  color: var(--text);
  font-weight: 400;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 12px 0;
}

.icon {
  font-size: 16px;
}

.colleagues {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  font-weight: 600;
}

.guideline-content {
  background: var(--bg-hover);
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.guideline-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px 0;
}

.guideline-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}
</style>