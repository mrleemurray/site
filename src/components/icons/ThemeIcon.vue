<template>
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g>
      <path d="M10 0C15.3502 -2.33867e-07 19.7195 4.20167 19.9873 9.48535C19.9959 9.6558 20 9.8274 20 10C20 10.1726 19.9959 10.3442 19.9873 10.5146C19.7195 15.7983 15.3502 20 10 20C9.8274 20 9.6558 19.9959 9.48535 19.9873C4.20167 19.7195 5.66746e-07 15.3502 0 10C-2.41411e-07 4.47715 4.47715 8.42747e-07 10 0ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18L10 2Z" fill="currentColor"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  theme: 'light' | 'dark'
}

defineProps<Props>()
</script>

