<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="container">
        <div class="hero-content">
          <h1 id="hero-title" class="hero-title">
            Welcome to My Portfolio
          </h1>
          <p class="hero-description">
            I'm a passionate developer focused on creating amazing digital experiences. 
            This is where I showcase my work and share my journey.
          </p>
          <div class="hero-actions">
            <router-link to="/projects" class="btn btn-primary">
              View My Work
            </router-link>
            <button @click="openAbout" class="btn btn-secondary">
              About Me
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="featured-projects" aria-labelledby="featured-title">
      <div class="container">
        <h2 id="featured-title" class="section-title">Featured Projects</h2>
        <p class="section-description">
          A selection of my recent work that I'm most proud of.
        </p>
        
        <div class="projects-grid grid grid-responsive">
          <!-- Project cards will be populated with actual content -->
          <div class="project-placeholder">
            <h3>Project 1</h3>
            <p>Project description will go here.</p>
          </div>
          <div class="project-placeholder">
            <h3>Project 2</h3>
            <p>Project description will go here.</p>
          </div>
          <div class="project-placeholder">
            <h3>Project 3</h3>
            <p>Project description will go here.</p>
          </div>
        </div>

        <div class="projects-cta">
          <router-link to="/projects" class="btn btn-secondary">
            View All Projects
          </router-link>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="skills" aria-labelledby="skills-title">
      <div class="container">
        <h2 id="skills-title" class="section-title">Skills & Technologies</h2>
        
        <div class="skills-grid">
          <div class="skill-category">
            <h3>Frontend</h3>
            <ul>
              <li>Vue.js</li>
              <li>React</li>
              <li>TypeScript</li>
              <li>SCSS/CSS</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Python</li>
              <li>APIs</li>
              <li>Databases</li>
            </ul>
          </div>
          <div class="skill-category">
            <h3>Tools</h3>
            <ul>
              <li>Git</li>
              <li>Vite</li>
              <li>Testing</li>
              <li>CI/CD</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Use a custom event to communicate with the App component
const openAbout = () => {
  window.dispatchEvent(new CustomEvent('open-about-modal'))
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
}

.hero {
  padding: var(--space-20) 0 var(--space-16);
  background: linear-gradient(
    135deg,
    var(--color-primary-50) 0%,
    var(--color-surface) 100%
  );
  
  @media (min-width: 768px) {
    padding: var(--space-24) 0 var(--space-20);
  }
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  margin-bottom: var(--space-6);
  background: linear-gradient(
    135deg,
    var(--color-text-primary) 0%,
    var(--color-primary-600) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-8);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
}

.featured-projects,
.skills {
  padding: var(--space-16) 0;
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-4);
}

.section-description {
  text-align: center;
  margin-bottom: var(--space-12);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.projects-grid {
  margin-bottom: var(--space-12);
}

.project-placeholder {
  padding: var(--space-8);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  text-align: center;
  
  h3 {
    margin-bottom: var(--space-4);
    color: var(--color-text-primary);
  }
  
  p {
    color: var(--color-text-secondary);
  }
}

.projects-cta {
  text-align: center;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-8);
}

.skill-category {
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  
  h3 {
    margin-bottom: var(--space-4);
    color: var(--color-primary-600);
  }
  
  ul {
    list-style: none;
    
    li {
      padding: var(--space-2) 0;
      color: var(--color-text-secondary);
    }
  }
}
</style>