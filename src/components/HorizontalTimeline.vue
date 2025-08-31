<template>
  <div 
    class="horizontal-timeline"
    role="region"
    aria-label="Professional timeline"
  >
    <div class="timeline-container">
      <!-- Timeline line -->
      <div class="timeline-line" aria-hidden="true">
        <div 
          class="timeline-progress" 
          :style="{ width: `${progressWidth}%` }"
        ></div>
      </div>
      
      <!-- Timeline markers -->
      <div class="timeline-markers">
        <button
          v-for="(item, index) in timelineData"
          :key="item.id"
          class="timeline-marker"
          :class="{ 
            'active': activeItem === index,
            'passed': activeItem !== null && index < activeItem,
            'above': index % 2 === 0,
            'below': index % 2 === 1
          }"
          :style="{ left: `${item.position}%` }"
          :aria-label="`View details for ${item.company} position from ${item.startDate} to ${item.endDate}`"
          :aria-expanded="activeItem === index"
          :aria-describedby="`timeline-content-${item.id}`"
          @click="setActiveItem(index)"
          @keydown="handleKeyDown($event, index)"
          :ref="(el) => { if (el) markerRefs[index] = el as HTMLButtonElement }"
        >
          <span class="marker-background" aria-hidden="true"></span>
          <span class="marker-dot" aria-hidden="true"></span>
          <span class="marker-pulse" aria-hidden="true"></span>
          
          <!-- Timeline label -->
          <div class="timeline-label">
            <span class="timeline-year">{{ item.startYear }}</span>
            <span class="timeline-company">{{ item.company }}</span>
            <span class="timeline-role">{{ item.jobTitle }}</span>
          </div>
        </button>
      </div>
    </div>
    
    <!-- Active item content -->
    <div 
      class="timeline-content"
      :class="{ 'visible': activeItem !== null }"
    >
      <div 
        v-if="activeTimelineItem"
        :id="`timeline-content-${activeTimelineItem.id}`"
        class="content-card"
        role="tabpanel"
        :aria-labelledby="`timeline-marker-${activeTimelineItem.id}`"
      >
        <div class="content-header">
          <h3 class="position-title">{{ activeTimelineItem.jobTitle }}</h3>
          <p class="company-name">{{ activeTimelineItem.company }}</p>
          <p class="date-range">{{ activeTimelineItem.startDate }} - {{ activeTimelineItem.endDate }}</p>
        </div>
        
        <div class="content-body">
          <p class="description">{{ activeTimelineItem.description }}</p>
          
          <div class="job-details">
            <p class="location" v-if="activeTimelineItem.location">
              <strong>Location:</strong> {{ activeTimelineItem.location }}
            </p>
          </div>
          
          <div v-if="activeTimelineItem.technologies?.length" class="technologies">
            <h4>Technologies Used</h4>
            <div class="tech-tags">
              <span 
                v-for="tech in activeTimelineItem.technologies" 
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// Types
interface TimelineItem {
  id: string
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  startYear: string
  description: string
  location: string
  technologies: string[]
  duration: number // in years for positioning
  position: number // percentage position on timeline
}

// Props
interface Props {
  data?: TimelineItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => []
})

// Load timeline data from JSON
import timelineDataJson from '../data/timeline.json'

// Process timeline data
const processTimelineData = (rawData: any[]): TimelineItem[] => {
  const currentYear = new Date().getFullYear()
  const startYear = 2006 // Fixed start year
  const totalYears = currentYear - startYear

  return rawData.map((item) => {
    const start = new Date(item.startDate)
    const end = item.endDate === 'Present' ? new Date() : new Date(item.endDate)
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    const yearsSinceStart = start.getFullYear() - startYear
    const position = (yearsSinceStart / totalYears) * 100

    return {
      ...item,
      startYear: start.getFullYear().toString(),
      duration,
      position: Math.max(2, Math.min(98, position)) // Better spacing from edges
    }
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
}
// Reactive state
const activeItem = ref<number | null>(0)
const markerRefs = ref<(HTMLButtonElement | undefined)[]>([])
const timelineData = computed(() => props.data.length > 0 ? props.data : processTimelineData(timelineDataJson))

// Computed properties
const activeTimelineItem = computed(() => {
  return activeItem.value !== null ? timelineData.value[activeItem.value] : null
})

const progressWidth = computed(() => {
  if (activeItem.value === null) return 0
  return timelineData.value[activeItem.value]?.position || 0
})

// Methods
const setActiveItem = (index: number) => {
  activeItem.value = index
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  const items = timelineData.value
  let newIndex = index
  
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      newIndex = index > 0 ? index - 1 : items.length - 1
      break
    case 'ArrowRight':
      event.preventDefault()
      newIndex = index < items.length - 1 ? index + 1 : 0
      break
    case 'Home':
      event.preventDefault()
      newIndex = 0
      break
    case 'End':
      event.preventDefault()
      newIndex = items.length - 1
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      setActiveItem(index)
      return
    default:
      return
  }
  
  setActiveItem(newIndex)
  nextTick(() => {
    const marker = markerRefs.value[newIndex]
    marker?.focus()
  })
}

// Auto-advance timeline (optional)
const autoAdvanceTimer = ref<number | null>(null)

const startAutoAdvance = () => {
  autoAdvanceTimer.value = window.setInterval(() => {
    if (activeItem.value === null) return
    const nextIndex = activeItem.value < timelineData.value.length - 1 
      ? activeItem.value + 1 
      : 0
    setActiveItem(nextIndex)
  }, 5000) // Change every 5 seconds
}

const stopAutoAdvance = () => {
  if (autoAdvanceTimer.value) {
    clearInterval(autoAdvanceTimer.value)
    autoAdvanceTimer.value = null
  }
}

// Lifecycle
onMounted(() => {
  // Optional: Start auto-advance
  // startAutoAdvance()
})

onUnmounted(() => {
  stopAutoAdvance()
})

// Expose methods for parent component
defineExpose({
  setActiveItem,
  startAutoAdvance,
  stopAutoAdvance
})
</script>

<style lang="scss" scoped>
.horizontal-timeline {
  padding: var(--space-8) 0;
  max-width: 100%;
  overflow: hidden;
}

.timeline-container {
  position: relative;
  padding: var(--space-4) var(--space-8) var(--space-12);
  margin-bottom: var(--space-4);
  
  @media (max-width: 768px) {
    padding: var(--space-12) var(--space-4) var(--space-8);
  }
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: var(--space-8);
  right: var(--space-8);
  height: 3px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  transform: translateY(-50%);
  
  @media (max-width: 768px) {
    left: var(--space-4);
    right: var(--space-4);
  }
}

.timeline-progress {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-primary-500) 0%,
    var(--color-primary-600) 100%
  );
  border-radius: var(--radius-full);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    width: 12px;
    height: 12px;
    background: var(--color-primary-600);
    border: 3px solid var(--color-background);
    border-radius: 50%;
    transform: translateY(-50%);
    transition: all var(--duration-normal) var(--ease-out);
  }
}

.timeline-markers {
  position: relative;
  height: 120px;
  margin: var(--space-6) 0;
}

.timeline-marker {
  position: absolute;
  top: 70%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  transition: all var(--duration-normal) var(--ease-out);
  
  &:focus-visible {
    .marker-dot {
      box-shadow: 0 0 0 3px var(--color-focus-ring);
    }
  }
  
  .marker-background {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-background);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -150%);
    z-index: 1;
  }

  .marker-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-border);
    border: 3px solid var(--color-background);
    position: relative;
    z-index: 2;
    transform: translateY(-100%); // Center the dot on the timeline line
  }
  
  .timeline-label {
    position: absolute;
    text-align: center;
    opacity: 0.8;
    white-space: nowrap;
    z-index: 2;
    
    .timeline-year {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-1);
    }
    
    .timeline-company {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary-600);
      margin-bottom: 2px;
    }
    
    .timeline-role {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-medium);
    }
  }

  @media (max-width: 768px) {
    & {
      top: 50%;
    }
  }
  
  // Positioning above the timeline
  &.above {
    .timeline-label {
      bottom: 200%;
      margin-bottom: var(--space-3);
    }
  }
  
  // Positioning below the timeline
  &.below {
    .timeline-label {
      top: 0%;
      margin-top: var(--space-3);
    }
  }
  
  &.active {
    .marker-dot {
      background: var(--color-primary-600);
      border-color: var(--color-background);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 254, 95, 85), 1);
    }
    
    .timeline-label {
      opacity: 1;
      
      .timeline-year {
        color: var(--color-primary-600);
      }
      
      .timeline-company {
        font-weight: var(--font-weight-bold);
      }
      
      .timeline-role {
        color: var(--color-text-primary);
        font-weight: var(--font-weight-semibold);
      }
    }
  }
  
  &.passed {
    .marker-dot {
      background: var(--color-primary-500);
      border-color: var(--color-background);
    }
    
    .timeline-label {
      opacity: 0.9;
      
      .timeline-company {
        color: var(--color-primary-500);
      }
    }
  }
  
  &:hover:not(.active) {
    .marker-dot {
      background: var(--color-primary-600);
    }
    
    .timeline-label {
      opacity: 1;
      // transform: scale(1.02);
    }
  }
}

.timeline-year {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.timeline-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all var(--duration-normal) var(--ease-out);
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  padding: var(--space-4) 0;
}

.content-header {
  margin-bottom: var(--space-4);
  padding: 0 var(--space-4) var(--space-4) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.position-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
  }
}

.company-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-600);
  margin-bottom: var(--space-1);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-base);
  }
}

.date-range {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

.content-body {
  padding: 0 var(--space-4);

  .description {
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
  }
  
  .job-details {
    margin-bottom: var(--space-4);
    
    .location {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin: 0;
      
      strong {
        color: var(--color-text-primary);
        font-weight: var(--font-weight-medium);
      }
    }
  }
  
  h4 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-3);
  }
}

.technologies {
  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  
  .tech-tag {
    display: inline-block;
    padding: var(--space-1) var(--space-3);
    background: var(--color-neutral-100);
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    transition: all var(--duration-fast) var(--ease-out);
    
    &:hover {
      background: var(--color-primary-50);
      border-color: var(--color-primary-200);
      color: var(--color-primary-700);
    }
  }
}

// Responsive design
@media (max-width: 640px) {
  .horizontal-timeline {
    padding: var(--space-4) 0;
  }
  
  .timeline-container {
    padding: var(--space-8) var(--space-2) var(--space-6);
  }
  
  .timeline-line {
    left: var(--space-2);
    right: var(--space-2);
  }
  
  .timeline-markers {
    height: 140px; // More height for mobile to accommodate larger labels
  }
  
  .timeline-marker {
    .timeline-label {
      .timeline-year {
        font-size: var(--font-size-xs);
      }
      
      .timeline-company {
        font-size: var(--font-size-xs);
        max-width: 80px;
        white-space: normal;
        line-height: 1.2;
      }
      
      .timeline-role {
        font-size: 10px;
        max-width: 80px;
        white-space: normal;
        line-height: 1.2;
      }
    }
    
    .marker-dot {
      width: 14px;
      height: 14px;
    }
  }
  
}

// Dark theme support
[data-theme="dark"] {
  .tech-tag {
    background: rgba(99, 132, 117, 0.2);
    border-color: var(--color-border);
    
    &:hover {
      background: rgba(254, 95, 85, 0.1);
      border-color: var(--color-primary-600);
      color: var(--color-primary-500);
    }
  }
  
  .marker-dot {
    background: var(--color-night);
  }
  
  .content-card {
    background: var(--color-surface);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  }
}

// Reduced motion preferences
@media (prefers-reduced-motion: reduce) {
  .timeline-progress,
  .timeline-item,
  .timeline-marker,
  .marker-dot,
  .timeline-label,
  .timeline-content {
    transition: none;
  }
  
  .marker-pulse {
    animation: none;
  }
}
</style>