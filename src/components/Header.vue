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
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 16px 0;
}

.header-content {
  max-width: 1048px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .title {
    font-size: 14px;
  }
}

.subtitle {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  margin: 2px 0 0 0;
}

.schedule-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .schedule-info {
    justify-content: center;
  }
}

.schedule-title {
  font-weight: 500;
}

.period {
  font-weight: 400;
  color: var(--text-tertiary);
}
</style>