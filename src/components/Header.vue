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
  background: linear-gradient(135deg, #0056b3 0%, #007bff 50%, #0056b3 100%);
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.95;
  display: block;
  margin-top: 0.5rem;
}

.schedule-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: #ffd700;
}

.period {
  font-size: 1rem;
  font-weight: 500;
  color: #e3f2fd;
  display: block;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .header {
    padding: 1.5rem 1rem;
  }
  
  .title {
    font-size: 1.4rem;
  }
  
  .schedule-title {
    font-size: 1.2rem;
  }
  
  .period {
    font-size: 0.9rem;
  }
}
</style>