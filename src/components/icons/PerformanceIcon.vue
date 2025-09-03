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
      <!-- Performance gauge icon -->
      <path d="M23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12H23ZM24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="currentColor"/>
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
