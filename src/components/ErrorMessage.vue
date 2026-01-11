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
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin: 1rem 0;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.error-text {
  color: #c53030;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}
</style>