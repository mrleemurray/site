<template>
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g v-if="mode !== 'full'">
      <!-- Performance gauge icon -->
      <path d="M10 20C4.47715 20 5.20257e-07 15.5228 8.74228e-07 10C1.35705e-06 4.47715 4.47715 -1.35705e-06 10 -8.74228e-07C15.5228 -3.91405e-07 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM10 18C14.4183 18 18 14.4183 18 10L2 10C2 14.4183 5.58172 18 10 18Z" fill="currentColor"/>
    </g>
    <g v-else>
      <path d="M10 0C15.5228 1.28855e-07 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C1.28855e-07 4.47715 4.47715 0 10 0ZM10 2C5.58172 2 2 5.58172 2 10H18C18 5.58172 14.4183 2 10 2Z" fill="currentColor"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  mode: 'full' | 'power-saver'
}

defineProps<Props>()
</script>
