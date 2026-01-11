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
        <span class="icon">👥</span>
        Colleagues in this Posting
      </h4>
      <p class="colleagues">{{ colleagues }}</p>
    </div>

    <div class="result-card guideline-card">
      <h4 class="card-title">
        <span class="icon">💡</span>
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
defineProps({
  result: Object,
  colleagues: String,
  guideline: Object
})
</script>

<style scoped>
.results-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.main-result {
  border-left-color: #28a745;
}

.department {
  font-size: 1.5rem;
  font-weight: 700;
  color: #28a745;
  margin: 0 0 1rem 0;
  text-align: center;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
}

.icon {
  font-size: 1.3rem;
}

.colleagues {
  font-size: 1rem;
  color: #495057;
  line-height: 1.5;
  margin: 0;
}

.guideline-card {
  border-left-color: #ffc107;
}

.guideline-content {
  background: #fff8e1;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ffe082;
}

.guideline-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f57c00;
  margin: 0 0 0.5rem 0;
}

.guideline-text {
  font-size: 1rem;
  color: #5d4037;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .results-container {
    gap: 1rem;
  }
  
  .result-card {
    padding: 1rem;
  }
  
  .department {
    font-size: 1.3rem;
  }
}
</style>