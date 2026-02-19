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
    <div class="input-wrapper">
      <input
        v-model="newTodo"
        type="text"
        placeholder="新しいTODOを入力..."
        class="todo-input"
        maxlength="500"
        @keydown.enter="handleAdd"
      />
      <span class="char-count" :class="{ 'over-limit': newTodo.length > 500 }">
        {{ newTodo.length }} / 500
      </span>
    </div>
    <button class="add-btn" :disabled="!newTodo.trim() || newTodo.length > 500" @click="handleAdd">
      追加
    </button>
  </div>
</template>

<style scoped>
.input-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.input-wrapper .todo-input {
  width: 100%;
}

.todo-input {
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

.char-count {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: #95a5a6;
}

.char-count.over-limit {
  color: #e74c3c;
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

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
  }
}
</style>
