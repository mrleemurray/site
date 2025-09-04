<template>
  <teleport to="body">
    <div 
      v-if="isOpen"
      ref="modalOverlayRef"
      class="modal-overlay" 
      @click="handleOverlayClick"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
    >
      <!-- Decorative diagonal stripe pattern -->
      <div class="diagonal-pattern"></div>
      
      <div class="modal-container" ref="modalContainer">
        <div ref="modalContentRef" class="modal-content">
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
            </div>
          </section>

          <!-- Timeline -->
          <section class="timeline-section">
            <h2 class="section-title">Professional Journey</h2>
            <HorizontalTimeline />
          </section>

          <!-- Contact Information -->
          <section class="contact-section">
            <h2 class="section-title">Get In Touch</h2>
            
            <div class="contact-methods">
              <div class="contact-method">
                <div class="contact-details">
                  <h3>Email</h3>
                  <a href="mailto:mrleemurray@gmail.com">mrleemurray@gmail.com</a>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-details">
                  <h3>LinkedIn</h3>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Connect with me on LinkedIn
                  </a>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-details">
                  <h3>GitHub</h3>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    View my code on GitHub
                  </a>
                </div>
              </div>

              <div class="contact-method">
                <div class="contact-details">
                  <h3>Figma</h3>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    View my plugins on Figma
                  </a>
                </div>
              </div>
            </div>

          </section>

          <!-- Personal Interests -->
          <section class="interests-section">
            <h2 class="section-title">Hobbies & Interests</h2>
            
            <div class="interests-grid">
              <div class="interest-item">
                <h3>Reading</h3>
                <p>Passionate about learning new technologies and staying current with industry trends.</p>
              </div>

              <div class="interest-item">
                <h3>Fitness</h3>
                <p>Staying active helps me maintain focus and creativity in my development work.</p>
              </div>

              <div class="interest-item">
                <h3>Music</h3>
                <p>Music fuels my creativity and helps me think through complex problems.</p>
              </div>

              <div class="interest-item">
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
import HorizontalTimeline from './HorizontalTimeline.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const modalContainer = ref<HTMLElement>()
const modalContentRef = ref<HTMLElement>()
const modalOverlayRef = ref<HTMLElement>()

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
      // Reset scroll position to top with multiple approaches
      setTimeout(() => {
        // Reset modal content scroll (desktop)
        if (modalContentRef.value) {
          modalContentRef.value.scrollTop = 0
          modalContentRef.value.scrollTo({ top: 0, behavior: 'instant' })
        }
        
        // Reset modal overlay scroll (mobile)
        if (modalOverlayRef.value) {
          modalOverlayRef.value.scrollTop = 0
          modalOverlayRef.value.scrollTo({ top: 0, behavior: 'instant' })
        }
      }, 50)
      
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
  background: color-mix(in srgb, var(--color-background) 80%, transparent);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: calc(3rem + var(--space-2));
  
  @media (max-width: 1280px) {
    padding-top: 3rem;
  }
}

.decoration-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

.diagonal-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  // opacity: 0.3;
  background-image: var(--pattern-diagonal-stripes);
  background-size: 18px 18px;
}

.modal-container {
  width: 100%;
  max-width: 1280px;
  max-height: calc(100vh - 3rem - var(--space-2) - var(--space-2));
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  // animation: slideUp var(--duration-normal) var(--ease-out);
  
  @media (max-width: 1280px) {
    max-height: calc(100vh - 3rem);
    padding: 0;
  }
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
  cursor: pointer;
  
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
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  
  /* Prevent layout shift by always reserving scrollbar space */
  scrollbar-gutter: stable;
  
  /* Minimal scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--color-text-secondary-rgb, 107, 114, 126), 0.3) transparent;

  @media (max-width: 768px) {
    padding: var(--space-2);
    margin: 0;
  }
  
  /* Fallback for browsers that don't support scrollbar-gutter */
  @supports not (scrollbar-gutter: stable) {
    padding-right: calc(var(--space-2) + 4px); /* Reduced to match scrollbar width more closely */
  }
  
  &::-webkit-scrollbar {
    width: 4px; /* Reduced width to match the padding adjustment */
    background: transparent;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 0px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--color-text-secondary-rgb, 107, 114, 126), 0.4);
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: padding-box; /* Creates padding effect */
    
    &:hover {
      background: rgba(var(--color-text-secondary-rgb, 107, 114, 126), 0.6);
    }
    
    &:active {
      background: rgba(var(--color-primary-rgb, 254, 95, 85), 0.7);
    }
  }

}

// Reuse existing About page styles
.intro-section,
.skills-section,
.timeline-section,
.contact-section,
.interests-section {
  margin-bottom: var(--space-12);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  margin-bottom: var(--space-4);
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.skills-grid {
  display: grid;
  gap: var(--space-4);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.skill-group {
  background: var(--color-background);
  border: 1px solid var(--color-border);
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
  background: color-mix(in srgb, var(--color-primary-600), transparent 80%);
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-primary-500) 0%,
    var(--color-primary-600) 100%
  );
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