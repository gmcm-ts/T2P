<template>
  <div class="faculty-results">
    <div class="result-card">
      <h3 class="title">
        <Building2 :size="16" />
        {{ title }}
      </h3>
      <ul class="results-content">
        <li v-for="item in result" :key="item.site">
          <strong>{{ item.site }}:</strong>
          {{ item.students }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { Building2 } from 'lucide-vue-next'

const props = defineProps({
  result: Array,
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
  font-size: 18px;
  line-height: 1.6;
  color: var(--text);
  font-weight: 700;
  letter-spacing: 1px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.results-content li {
  margin-bottom: 12px;
  padding: 12px;
  background: var(--bg-hover);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.results-content li:last-child {
  margin-bottom: 0;
}

.results-content strong {
  color: var(--text);
  font-weight: 500;
  font-size: 13px;
  display: block;
  margin-bottom: 4px;
}
</style>