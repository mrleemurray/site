<template>
  <teleport to="body">
    <div 
      v-if="isOpen"
      class="modal-overlay" 
      @click="handleOverlayClick"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
    >
      <div class="modal-container" ref="modalContainer">
        <!-- <header class="modal-header">
          <h1 id="about-title" class="modal-title">About Me</h1>
          <button 
            class="close-button"
            @click="$emit('close')"
            aria-label="Close about dialog"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </header> -->

        <div class="modal-content">
          <!-- Personal Introduction -->
          <section class="intro-section">
            <div class="intro-grid">
              <div class="intro-content">
                <h2>Lee Murray</h2>
                <p>
                  My interests & skills blend the boundary between designer & developer, using technology to evolve the design experience to the highest standards; from simple test mock-ups to hardware preproduction prototypes, my unusual hybrid skillsets combine hardware design with software as well as web technology.
                </p>
                <p>
                  I thrive in teams where I can lead hardware & software prototyping efforts in an organisation, promoting the mindset of rapid design iterations, learning from mistakes & crafting experiences. With this ideal in mind, my passion is to harmonise design & engineering teams to allow for seamless collaborations, culminating in incredibly well crafted, compelling products & services.
                </p>
              </div>
              <!-- <div class="intro-image">
                <div class="image-placeholder">
                  Your Photo
                </div>
              </div> -->
            </div>
          </section>

          <!-- Skills & Experience -->
          <section class="skills-section">
            <h2 class="section-title">Skills & Experience</h2>
            
            <div class="skills-grid">
              <div class="skill-group">
                <h3>Frontend Development</h3>
                <div class="skill-list">
                  <div class="skill-item">
                    <span class="skill-name">Vue.js</span>
                    <div class="skill-bar">
                      <div class="skill-progress" style="width: 90%"></div>
                    </div>
                  </div>
                  <div class="skill-item">
                    <span class="skill-name">TypeScript</span>
                    <div class="skill-bar">
                      <div class="skill-progress" style="width: 85%"></div>
                    </div>
                  </div>
                  <div class="skill-item">
                    <span class="skill-name">CSS/SCSS</span>
                    <div class="skill-bar">
                      <div class="skill-progress" style="width: 95%"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="skill-group">
                <h3>Backend Development</h3>
                <div class="skill-list">
                  <div class="skill-item">
                    <span class="skill-name">Node.js</span>
                    <div class="skill-bar">
                      <div class="skill-progress" style="width: 80%"></div>
                    </div>
                  </div>
                  <div class="skill-item">
                    <span class="skill-name">Python</span>
                    <div class="skill-bar">
                      <div class="skill-progress" style="width: 75%"></div>
                    </div>
                  </div>
                  <div class="skill-item">
                    <span class="skill-name">Databases</span>
                    <div class="skill-bar">
                      <div class="skill-progress" style="width: 70%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Timeline -->
          <section class="timeline-section">
            <h2 class="section-title">Professional Journey</h2>
            
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h3>Current Position</h3>
                  <p class="timeline-company">Company Name</p>
                  <p class="timeline-date">2023 - Present</p>
                  <p>
                    Description of your current role and responsibilities. 
                    Highlight key achievements and technologies you work with.
                  </p>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h3>Previous Position</h3>
                  <p class="timeline-company">Previous Company</p>
                  <p class="timeline-date">2021 - 2023</p>
                  <p>
                    Description of your previous role. What did you learn? 
                    What projects did you work on?
                  </p>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h3>Education / Beginning</h3>
                  <p class="timeline-company">University / Self-taught</p>
                  <p class="timeline-date">2019 - 2021</p>
                  <p>
                    Your educational background or how you started your development journey.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Contact Information -->
          <section class="contact-section">
            <h2 class="section-title">Get In Touch</h2>
            
            <div class="contact-methods">
              <div class="contact-method">
                <div class="contact-icon">📧</div>
                <div class="contact-details">
                  <h3>Email</h3>
                  <a href="mailto:your.email@example.com">your.email@example.com</a>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-icon">💼</div>
                <div class="contact-details">
                  <h3>LinkedIn</h3>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Connect with me on LinkedIn
                  </a>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-icon">🐙</div>
                <div class="contact-details">
                  <h3>GitHub</h3>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    View my code on GitHub
                  </a>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-icon">📱</div>
                <div class="contact-details">
                  <h3>Calendar</h3>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Schedule a 30-minute call
                  </a>
                </div>
              </div>
            </div>

            <!-- Availability -->
            <div class="availability">
              <h3>Availability</h3>
              <p>
                I'm currently <strong>available for new projects</strong> and collaborations. 
                I typically respond to messages within 24 hours.
              </p>
            </div>
          </section>

          <!-- Personal Interests -->
          <section class="interests-section">
            <h2 class="section-title">When I'm Not Coding</h2>
            
            <div class="interests-grid">
              <div class="interest-item">
                <div class="interest-icon">📚</div>
                <h3>Reading</h3>
                <p>Passionate about learning new technologies and staying current with industry trends.</p>
              </div>

              <div class="interest-item">
                <div class="interest-icon">🏃‍♂️</div>
                <h3>Fitness</h3>
                <p>Staying active helps me maintain focus and creativity in my development work.</p>
              </div>

              <div class="interest-item">
                <div class="interest-icon">🎵</div>
                <h3>Music</h3>
                <p>Music fuels my creativity and helps me think through complex problems.</p>
              </div>

              <div class="interest-item">
                <div class="interest-icon">✈️</div>
                <h3>Travel</h3>
                <p>Exploring new places and cultures broadens my perspective and inspires new ideas.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const modalContainer = ref<HTMLElement>()

const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

// Trap focus within modal
const trapFocus = (event: KeyboardEvent) => {
  if (!props.isOpen || !modalContainer.value) return
  
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  
  if (event.key === 'Tab') {
    const focusableElements = modalContainer.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus()
        event.preventDefault()
      }
    }
  }
}

// Manage body scroll and focus
onMounted(() => {
  if (props.isOpen) {
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      const firstButton = modalContainer.value?.querySelector('button') as HTMLElement
      firstButton?.focus()
    })
  }
  
  document.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', trapFocus)
})

// Watch for isOpen changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      const firstButton = modalContainer.value?.querySelector('button') as HTMLElement
      firstButton?.focus()
    })
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: color-mix(in srgb, var(--color-background) 20%, transparent);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: var(--space-4);
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.modal-container {
  background: var(--color-background);
  // box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 1280px;
  max-height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp var(--duration-normal) var(--ease-out);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover, &:focus {
    background: var(--color-neutral-100);
    color: var(--color-text-primary);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  max-width: 1280px;
  margin: calc(3rem + var(--space-2)) var(--space-2) var(--space-2);
  padding: var(--space-4);
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-neutral-100);
    border-radius: var(--radius-full);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-neutral-300);
    border-radius: var(--radius-full);
    
    &:hover {
      background: var(--color-neutral-400);
    }
  }
}

// Reuse existing About page styles
.intro-section,
.skills-section,
.timeline-section,
.contact-section,
.interests-section {
  margin-bottom: var(--space-16);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-8);
  font-size: var(--font-size-xl);
  color: var(--color-primary-600);
}

.intro-grid {
  display: grid;
  gap: var(--space-8);
  align-items: center;
  
  // @media (min-width: 768px) {
  //   grid-template-columns: 2fr 1fr;
  // }
}

.intro-content {
  h2 {
    margin-bottom: var(--space-4);
    color: var(--color-primary-600);
  }
  
  p {
    margin-bottom: var(--space-4);
    line-height: var(--line-height-relaxed);
    color: var(--color-text-secondary);
  }
}

.intro-image {
  display: flex;
  justify-content: center;
}

.image-placeholder {
  width: 200px;
  height: 200px;
  background: var(--color-neutral-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.skills-grid {
  display: grid;
  gap: var(--space-6);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.skill-group {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  
  h3 {
    margin-bottom: var(--space-4);
    color: var(--color-primary-600);
  }
}

.skill-item {
  margin-bottom: var(--space-4);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.skill-name {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.skill-bar {
  height: 6px;
  background: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-primary-500) 0%,
    var(--color-primary-600) 100%
  );
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
}

.timeline {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-border);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: var(--space-8);
  margin-left: var(--space-12);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: -32px;
  top: 0;
  width: 12px;
  height: 12px;
  background: var(--color-primary-600);
  border: 2px solid var(--color-surface);
  border-radius: 50%;
}

.timeline-content {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  
  h3 {
    margin-bottom: var(--space-1);
    color: var(--color-text-primary);
    font-size: var(--font-size-lg);
  }
  
  .timeline-company {
    font-weight: var(--font-weight-medium);
    color: var(--color-primary-600);
    margin-bottom: var(--space-1);
    font-size: var(--font-size-sm);
  }
  
  .timeline-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-3);
  }
  
  p:last-child {
    margin-bottom: 0;
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    font-size: var(--font-size-sm);
  }
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.contact-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.contact-details {
  h3 {
    margin-bottom: var(--space-1);
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
  }
  
  a {
    color: var(--color-primary-600);
    text-decoration: none;
    font-size: var(--font-size-sm);
    
    &:hover, &:focus {
      color: var(--color-primary-700);
      text-decoration: underline;
    }
  }
}

.availability {
  padding: var(--space-4);
  background: var(--color-primary-50);
  border-radius: var(--radius-lg);
  text-align: center;
  
  h3 {
    margin-bottom: var(--space-3);
    color: var(--color-primary-700);
    font-size: var(--font-size-base);
  }
  
  p {
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    font-size: var(--font-size-sm);
    
    strong {
      color: var(--color-primary-700);
    }
  }
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.interest-item {
  text-align: center;
  padding: var(--space-4);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: transform var(--duration-normal) var(--ease-out);
  
  &:hover {
    transform: translateY(-2px);
  }
  
  .interest-icon {
    font-size: 2rem;
    margin-bottom: var(--space-3);
  }
  
  h3 {
    margin-bottom: var(--space-2);
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
  }
  
  p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-relaxed);
  }
}

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>