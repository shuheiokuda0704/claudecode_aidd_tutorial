<script setup lang="ts">
const emit = defineEmits<{
  add: [text: string]
}>()

const newTodo = ref('')

const handleAdd = () => {
  if (newTodo.value.trim()) {
    emit('add', newTodo.value.trim())
    newTodo.value = ''
  }
}
</script>

<template>
  <div class="input-section">
    <input
      v-model="newTodo"
      type="text"
      placeholder="新しいTODOを入力..."
      class="todo-input"
      @keydown.enter="handleAdd"
    />
    <button class="add-btn" @click="handleAdd">追加</button>
  </div>
</template>

<style scoped>
.input-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.todo-input:focus {
  outline: none;
  border-color: #3498db;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
  }
}
</style>
