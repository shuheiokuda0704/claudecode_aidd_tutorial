<script setup lang="ts">
defineProps<{
  message: string | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div v-if="message" class="error-message" role="alert" aria-live="polite">
    <span>{{ message }}</span>
    <button class="close-btn" aria-label="エラーメッセージを閉じる" @click="emit('close')">
      ×
    </button>
  </div>
</template>

<style scoped>
.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-btn {
  background: none;
  border: none;
  color: #c33;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0.5rem;
  line-height: 1;
}

.close-btn:hover {
  opacity: 0.7;
}
</style>
