<template>
  <div class="error-message">
    <div class="error-icon">⚠️</div>
    <p class="error-text">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>

<style scoped>
.error-message {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
  margin: 16px 0;
}

.error-icon {
  font-size: 20px;
  margin-bottom: 8px;
}

.error-text {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}
</style>