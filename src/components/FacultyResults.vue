<template>
  <div class="faculty-results">
    <div class="result-card">
      <h3 class="title">
        <span class="icon">🏥</span>
        Faculty View Results
      </h3>
      <div class="results-content" v-html="result"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  result: String
})
</script>

<style scoped>
.faculty-results {
  margin-top: 1rem;
}

.result-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #6f42c1;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: #6f42c1;
  margin: 0 0 1rem 0;
}

.icon {
  font-size: 1.4rem;
}

.results-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}

.results-content :deep(ul) {
  list-style: none;
  padding: 0;
}

.results-content :deep(li) {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #6f42c1;
}

.results-content :deep(strong) {
  color: #6f42c1;
  font-weight: 600;
}
</style>