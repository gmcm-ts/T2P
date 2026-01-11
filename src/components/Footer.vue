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
          <BarChart3 :size="16" /> View Complete Schedule
        </a>
        <a 
          :href="`mailto:drdpdev@gmail.com?subject=T2P Issue Report - Ticket ${generateTicketNumber()}&body=Date: ${new Date().toLocaleString()}%0D%0A%0D%0APlease describe the issue:%0D%0A`" 
          class="footer-link"
        >
          <Bug :size="16" /> Report an Issue
        </a>
      </div>
      
      <div class="disclaimer">
        <p>This site may contain errors — verify and report issues here.</p>
        <p>Please verify information independently before reporting to duties.</p>
      </div>
      
      <div class="copyright">
        <p>©Dr_dp 2025. Version 2.3. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { BarChart3, Bug } from 'lucide-vue-next'

const generateTicketNumber = () => {
  const now = new Date()
  const timestamp = now.getTime().toString().slice(-6)
  return `T2P${timestamp}`
}
</script>

<style scoped>
.footer {
  background: var(--bg-card);
  color: var(--text);
  padding: 32px 16px 24px;
  margin-top: 32px;
  border-top: 1px solid var(--border);
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
  gap: 8px;
  padding: 12px 16px;
  background: transparent;
  color: var(--text);
  text-decoration: none;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 14px;
  transition: opacity 0.15s ease;
  border: 1px solid var(--border);
}

.footer-link:hover {
  background: var(--bg-hover);
}

.disclaimer {
  margin-bottom: 24px;
  color: var(--text-secondary);
}

.disclaimer p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.5;
}

.copyright {
  color: var(--text-tertiary);
  font-size: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
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