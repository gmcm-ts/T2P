<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="links">
        <a 
          href="https://docs.google.com/spreadsheets/d/1ZieRF7JE97GgNjVMtKSsOXWcUVvyQOjf/edit?usp=sharing&ouid=116512367941844366243&rtpof=true&sd=true" 
          target="_blank" 
          rel="noopener noreferrer"
          class="footer-link"
        >
          📊 View Complete Schedule
        </a>
        <a 
          href="https://github.com/gmcm-ts/T2P/issues/new" 
          target="_blank" 
          rel="noopener noreferrer"
          class="footer-link"
        >
          🐛 Report an Issue
        </a>
      </div>
      
      <div class="disclaimer">
        <p>This site may contain errors — verify and report issues here.</p>
        <p>Please verify information independently before reporting to duties.</p>
      </div>
      
      <div class="copyright">
        <p>©Dr_dp 2025. Version 2.1. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: 3rem 1rem 2rem;
  margin-top: 4rem;
  border-top: 1px solid var(--border-primary);
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: var(--accent-primary);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s;
  box-shadow: var(--shadow-sm);
}

.footer-link:hover {
  background: var(--accent-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.disclaimer {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.disclaimer p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.copyright {
  color: var(--text-tertiary);
  font-size: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-primary);
}

.copyright p {
  margin: 0;
}

@media (max-width: 640px) {
  .footer {
    padding: 2rem 1rem 1.5rem;
  }
  
  .links {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .footer-link {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}
</style>