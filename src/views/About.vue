<template>
  <div class="about">
    <div class="container">
      <!-- Page Header -->
      <header class="page-header">
        <h1 class="page-title">About Me</h1>
        <p class="page-description">
          Learn more about my background, skills, and what drives my passion for development.
        </p>
      </header>

      <!-- Personal Introduction -->
      <section class="intro-section">
        <div class="intro-grid">
          <div class="intro-content">
            <h2>Hello, I'm [Your Name]</h2>
            <p>
              This is where you'll write your personal introduction. Talk about your journey 
              into development, what you're passionate about, and what makes you unique as a developer.
            </p>
            <p>
              Share your story, your motivations, and give visitors a sense of who you are 
              beyond just your technical skills.
            </p>
          </div>
          <div class="intro-image">
            <div class="image-placeholder">
              Your Photo
            </div>
          </div>
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
</template>

<script setup lang="ts">
// Component logic will be added when content is provided
</script>

<style lang="scss" scoped>
.about {
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
}

.intro-section {
  margin-bottom: var(--space-20);
}

.intro-grid {
  display: grid;
  gap: var(--space-12);
  align-items: center;
  
  @media (min-width: var(--breakpoint-md)) {
    grid-template-columns: 2fr 1fr;
    gap: var(--space-16);
  }
}

.intro-content {
  h2 {
    margin-bottom: var(--space-6);
    color: var(--color-primary-600);
  }
  
  p {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-lg);
    line-height: var(--line-height-relaxed);
    color: var(--color-text-secondary);
  }
}

.intro-image {
  display: flex;
  justify-content: center;
}

.image-placeholder {
  width: 250px;
  height: 250px;
  background: var(--color-neutral-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
}

.skills-section,
.timeline-section,
.interests-section {
  margin-bottom: var(--space-20);
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-12);
}

.skills-grid {
  display: grid;
  gap: var(--space-8);
  
  @media (min-width: var(--breakpoint-md)) {
    grid-template-columns: 1fr 1fr;
  }
}

.skill-group {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  
  h3 {
    margin-bottom: var(--space-6);
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
}

.skill-bar {
  height: 8px;
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
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-border);
    
    @media (min-width: var(--breakpoint-md)) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.timeline-item {
  position: relative;
  margin-bottom: var(--space-12);
  margin-left: var(--space-16);
  
  @media (min-width: var(--breakpoint-md)) {
    width: 50%;
    margin-left: 0;
    
    &:nth-child(even) {
      margin-left: 50%;
      padding-left: var(--space-8);
    }
    
    &:nth-child(odd) {
      padding-right: var(--space-8);
      text-align: right;
    }
  }
}

.timeline-marker {
  position: absolute;
  left: -42px;
  top: 0;
  width: 16px;
  height: 16px;
  background: var(--color-primary-600);
  border: 3px solid var(--color-surface);
  border-radius: 50%;
  
  @media (min-width: var(--breakpoint-md)) {
    left: -8px;
    
    .timeline-item:nth-child(even) & {
      left: -8px;
    }
    
    .timeline-item:nth-child(odd) & {
      right: -8px;
      left: auto;
    }
  }
}

.timeline-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  
  h3 {
    margin-bottom: var(--space-2);
    color: var(--color-text-primary);
  }
  
  .timeline-company {
    font-weight: var(--font-weight-medium);
    color: var(--color-primary-600);
    margin-bottom: var(--space-1);
  }
  
  .timeline-date {
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-4);
  }
  
  p:last-child {
    margin-bottom: 0;
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
  }
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-8);
}

.interest-item {
  text-align: center;
  padding: var(--space-8);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  
  &:hover {
    transform: translateY(-4px);
  }
  
  .interest-icon {
    font-size: 3rem;
    margin-bottom: var(--space-4);
  }
  
  h3 {
    margin-bottom: var(--space-3);
    color: var(--color-text-primary);
  }
  
  p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
  }
}
</style>