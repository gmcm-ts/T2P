<template>
  <div class="faculty-results">
    <div class="result-card">
      <h3 class="title">
        <span class="icon">🏥</span>
        {{ title }}
      </h3>
      <div class="results-content" v-html="result"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  result: String,
  title: String
})
</script>

<style scoped>
.faculty-results {
  margin-top: 16px;
}

.result-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}

.title {
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

.results-content {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
}

.results-content :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.results-content :deep(li) {
  margin-bottom: 12px;
  padding: 12px;
  background: var(--bg-hover);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.results-content :deep(li:last-child) {
  margin-bottom: 0;
}

.results-content :deep(strong) {
  color: var(--text);
  font-weight: 600;
}
</style>