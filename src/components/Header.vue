<template>
  <header class="header">
    <div class="header-content">
      <h1 class="title">
        GOVERNMENT GENERAL HOSPITAL<br>
        AND MEDICAL COLLEGE<br>
        <span class="subtitle">MAHABUBNAGAR, T.S. PIN: 509001</span>
      </h1>
      <p class="schedule-title">
        INTERNSHIP SCHEDULE<br>
        <span class="period">[ 21 APR 2025 - 20 APR 2026 ]</span>
      </p>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  border-bottom: 3px solid #007bff;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.subtitle {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.9;
}

.schedule-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #007bff;
}

.period {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.2rem;
  }
  
  .schedule-title {
    font-size: 1rem;
  }
}
</style>