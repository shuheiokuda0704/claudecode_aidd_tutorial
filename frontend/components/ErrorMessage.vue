<script setup lang="ts">
defineProps<{
  message: string | null
}>()
</script>

<template>
  <div v-if="message" class="error-message">
    {{ message }}
  </div>
</template>

<style scoped>
.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
