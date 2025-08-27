<template>
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-content">
        <!-- Brand/Copyright -->
        <div class="footer-brand">
          <p class="copyright">
            © {{ currentYear }} Portfolio. All rights reserved.
          </p>
        </div>

        <!-- Social Links -->
        <nav class="social-nav" aria-label="Social media links">
          <ul class="social-links">
            <li>
              <a 
                href="#" 
                class="social-link"
                aria-label="GitHub profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon />
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="social-link"
                aria-label="LinkedIn profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon />
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="social-link"
                aria-label="Twitter profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </a>
            </li>
          </ul>
        </nav>

        <!-- Accessibility Statement -->
        <div class="footer-info">
          <p class="accessibility-note">
            This site is designed to be accessible and follows WCAG 2.1 AA guidelines.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GithubIcon from './icons/GithubIcon.vue'
import LinkedinIcon from './icons/LinkedinIcon.vue'
import TwitterIcon from './icons/TwitterIcon.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--space-12) 0 var(--space-8);
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  text-align: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
}

.footer-brand {
  order: 2;
  
  @media (min-width: 768px) {
    order: 1;
  }
}

.copyright {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.social-nav {
  order: 1;
  
  @media (min-width: 768px) {
    order: 2;
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  list-style: none;
  
  @media (min-width: 768px) {
    justify-content: flex-end;
  }
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-text-tertiary);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    background: var(--color-neutral-100);
    color: var(--color-text-primary);
    text-decoration: none;
    transform: translateY(-2px);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.footer-info {
  order: 3;
}

.accessibility-note {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  
  @media (min-width: 768px) {
    text-align: center;
  }
}
</style>