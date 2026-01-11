<template>
  <header class="header">
    <div class="header-content">
      <h1 class="title">
        <span class="hospital-name">GOVERNMENT GENERAL HOSPITAL AND MEDICAL COLLEGE</span>
        <span class="location">MAHABUBNAGAR, T.S. PIN: 509001</span>
      </h1>
      <div class="schedule-info">
        <span class="schedule-title">INTERNSHIP SCHEDULE</span>
        <span class="period">[ 21 APR 2025 - 20 APR 2026 ]</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 12px 0;
}

.header-content {
  max-width: 1048px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
}

.title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
  line-height: 1.3;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

@media (min-width: 768px) {
  .title {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .title {
    font-size: 16px;
  }
}

.hospital-name {
  font-weight: 600;
}

@media (min-width: 1025px) {
  .hospital-name::after {
    content: " ";
  }
}

.location {
  font-size: 11px;
  font-weight: 400;
  color: var(--text-secondary);
}

@media (min-width: 768px) {
  .location {
    font-size: 12px;
  }
}

@media (min-width: 1025px) {
  .location {
    display: inline;
  }
}

.schedule-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 12px;
}

@media (max-width: 1024px) {
  .schedule-info {
    align-items: center;
  }
}

@media (min-width: 768px) {
  .schedule-info {
    font-size: 13px;
  }
}

.schedule-title {
  font-weight: 600;
  color: var(--text);
}

.period {
  font-weight: 400;
  color: var(--text-tertiary);
  font-size: 11px;
}

@media (min-width: 768px) {
  .period {
    font-size: 12px;
  }
}
</style>