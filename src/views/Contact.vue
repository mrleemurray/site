<template>
  <div class="contact">
    <div class="container">
      <!-- Page Header -->
      <header class="page-header">
        <h1 class="page-title">Get In Touch</h1>
        <p class="page-description">
          I'd love to hear from you! Whether you have a project in mind, 
          want to collaborate, or just want to say hello.
        </p>
      </header>

      <div class="contact-content">
        <!-- Contact Form -->
        <section class="contact-form-section">
          <h2>Send me a message</h2>
          
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name" class="form-label">Name *</label>
              <input
                id="name"
                type="text"
                v-model="form.name"
                class="form-input"
                :class="{ 'form-input--error': errors.name }"
                required
                aria-describedby="name-error"
              >
              <p v-if="errors.name" id="name-error" class="form-error">
                {{ errors.name }}
              </p>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email *</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                class="form-input"
                :class="{ 'form-input--error': errors.email }"
                required
                aria-describedby="email-error"
              >
              <p v-if="errors.email" id="email-error" class="form-error">
                {{ errors.email }}
              </p>
            </div>

            <div class="form-group">
              <label for="subject" class="form-label">Subject *</label>
              <input
                id="subject"
                type="text"
                v-model="form.subject"
                class="form-input"
                :class="{ 'form-input--error': errors.subject }"
                required
                aria-describedby="subject-error"
              >
              <p v-if="errors.subject" id="subject-error" class="form-error">
                {{ errors.subject }}
              </p>
            </div>

            <div class="form-group">
              <label for="message" class="form-label">Message *</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-textarea"
                :class="{ 'form-input--error': errors.message }"
                rows="6"
                required
                aria-describedby="message-error"
              ></textarea>
              <p v-if="errors.message" id="message-error" class="form-error">
                {{ errors.message }}
              </p>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary form-submit"
              :disabled="isSubmitting"
              :aria-label="isSubmitting ? 'Sending message...' : 'Send message'"
            >
              <span v-if="!isSubmitting">Send Message</span>
              <span v-else>Sending...</span>
            </button>

            <!-- Success/Error Messages -->
            <div v-if="submitStatus === 'success'" class="form-message form-message--success" role="alert">
              Thank you! Your message has been sent successfully.
            </div>
            
            <div v-if="submitStatus === 'error'" class="form-message form-message--error" role="alert">
              Sorry, there was an error sending your message. Please try again.
            </div>
          </form>
        </section>

        <!-- Contact Information -->
        <aside class="contact-info">
          <h2>Other ways to reach me</h2>
          
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
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Form state
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

// Form validation
const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!form.name.trim()) {
    newErrors.name = 'Name is required'
  }

  if (!form.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (!form.subject.trim()) {
    newErrors.subject = 'Subject is required'
  }

  if (!form.message.trim()) {
    newErrors.message = 'Message is required'
  } else if (form.message.trim().length < 10) {
    newErrors.message = 'Message must be at least 10 characters long'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  submitStatus.value = 'idle'

  try {
    // This is where you would integrate with your backend or email service
    // For now, we'll simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    submitStatus.value = 'success'
    
    // Reset form
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
    errors.value = {}
    
  } catch (error) {
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.contact {
  padding: var(--space-8) 0 var(--space-16);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.page-title {
  margin-bottom: var(--space-4);
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

.contact-content {
  display: grid;
  gap: var(--space-12);
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
    gap: var(--space-16);
  }
}

.contact-form-section {
  h2 {
    margin-bottom: var(--space-8);
  }
}

.contact-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
}

.form-group {
  margin-bottom: var(--space-6);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  
  &:focus {
    border-color: var(--color-primary-500);
    outline: none;
  }
  
  &--error {
    border-color: var(--color-error);
  }
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.form-error {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

.form-submit {
  width: 100%;
  justify-content: center;
  margin-bottom: var(--space-6);
}

.form-message {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  
  &--success {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }
  
  &--error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }
}

.contact-info {
  h2 {
    margin-bottom: var(--space-8);
  }
}

.contact-methods {
  margin-bottom: var(--space-12);
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.contact-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.contact-details {
  h3 {
    margin-bottom: var(--space-2);
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
  }
  
  a {
    color: var(--color-primary-600);
    text-decoration: none;
    
    &:hover, &:focus {
      color: var(--color-primary-700);
      text-decoration: underline;
    }
  }
}

.availability {
  padding: var(--space-6);
  background: var(--color-primary-50);
  border-radius: var(--radius-xl);
  
  h3 {
    margin-bottom: var(--space-4);
    color: var(--color-primary-700);
  }
  
  p {
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    
    strong {
      color: var(--color-primary-700);
    }
  }
}
</style>