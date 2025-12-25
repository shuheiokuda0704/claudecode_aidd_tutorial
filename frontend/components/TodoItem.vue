<script setup lang="ts">
import type { Todo } from '~/types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
  update: [id: string, text: string]
}>()

const isEditing = ref(false)
const editingText = ref('')
const editInputRef = ref<HTMLInputElement>()

const startEdit = () => {
  isEditing.value = true
  editingText.value = props.todo.text
  nextTick(() => {
    editInputRef.value?.focus()
  })
}

const cancelEdit = () => {
  isEditing.value = false
  editingText.value = ''
}

const saveEdit = () => {
  if (editingText.value.trim()) {
    emit('update', props.todo.id, editingText.value.trim())
    isEditing.value = false
  } else {
    cancelEdit()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <li class="todo-item">
    <div class="todo-content">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="emit('toggle', todo.id)"
        class="todo-checkbox"
      />
      <span
        v-if="!isEditing"
        :class="{ completed: todo.completed }"
        class="todo-text"
        @dblclick="startEdit"
      >
        {{ todo.text }}
      </span>
      <input
        v-else
        ref="editInputRef"
        v-model="editingText"
        type="text"
        class="edit-input"
        @blur="saveEdit"
        @keydown="handleKeydown"
      />
    </div>
    <div class="todo-actions">
      <button
        v-if="!isEditing"
        @click="startEdit"
        class="edit-btn"
      >
        編集
      </button>
      <button
        v-if="isEditing"
        @click="saveEdit"
        class="save-btn"
      >
        保存
      </button>
      <button
        v-if="isEditing"
        @click="cancelEdit"
        class="cancel-btn"
      >
        キャンセル
      </button>
      <button
        v-if="!isEditing"
        @click="emit('remove', todo.id)"
        class="delete-btn"
      >
        削除
      </button>
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  transition: background 0.3s;
}

.todo-item:hover {
  background: #f8f9fa;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  color: #2c3e50;
  cursor: pointer;
  user-select: none;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #95a5a6;
}

.edit-input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #3498db;
  border-radius: 6px;
  font-size: 1rem;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.save-btn,
.cancel-btn,
.delete-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: opacity 0.3s;
}

.edit-btn {
  background: #f39c12;
  color: white;
}

.edit-btn:hover {
  opacity: 0.8;
}

.save-btn {
  background: #27ae60;
  color: white;
}

.save-btn:hover {
  opacity: 0.8;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  opacity: 0.8;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.delete-btn:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .todo-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
