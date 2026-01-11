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
        <p>©Dr_dp 2025. Version 2.0. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 2rem 1rem;
  margin-top: 3rem;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.2s;
}

.footer-link:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.disclaimer {
  margin-bottom: 1rem;
  opacity: 0.8;
}

.disclaimer p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.copyright {
  opacity: 0.6;
  font-size: 0.8rem;
}

.copyright p {
  margin: 0;
}

@media (max-width: 768px) {
  .links {
    flex-direction: column;
    align-items: center;
  }
  
  .footer-link {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>