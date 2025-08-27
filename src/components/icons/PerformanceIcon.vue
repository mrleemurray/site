<template>
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g v-if="mode === 'full'">
      <!-- Settings/Gear icon -->
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M12 1v6M12 17v6M20.49 9l-5.1 3M8.61 15l-5.1 3M20.49 15l-5.1-3M8.61 9l-5.1-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </g>
    <g v-else>
      <!-- Battery/Power saver icon -->
      <rect x="2" y="7" width="18" height="10" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
      <line x1="22" y1="11" x2="22" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <rect x="4" y="9" width="12" height="6" fill="currentColor"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  mode: 'full' | 'power-saver'
}

defineProps<Props>()
</script>