<script setup lang="ts">
import type { Todo, FilterType } from '~/types/todo'

defineProps<{
  todos: Todo[]
  filter: FilterType
}>()

const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
  update: [id: string, text: string]
}>()

const getEmptyMessage = (filter: FilterType) => {
  switch (filter) {
    case 'active':
      return '進行中のTODOがありません'
    case 'completed':
      return '完了済みのTODOがありません'
    default:
      return 'TODOがありません'
  }
}
</script>

<template>
  <div>
    <ul v-if="todos.length > 0" class="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="emit('toggle', $event)"
        @remove="emit('remove', $event)"
        @update="(id, text) => emit('update', id, text)"
      />
    </ul>

    <div v-else class="empty-state">
      <p>{{ getEmptyMessage(filter) }}</p>
    </div>
  </div>
</template>

<style scoped>
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #95a5a6;
}
</style>
