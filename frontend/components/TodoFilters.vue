<script setup lang="ts">
import type { FilterType } from '~/types/todo'

defineProps<{
  currentFilter: FilterType
  activeTodosCount: number
}>()

const emit = defineEmits<{
  updateFilter: [filter: FilterType]
}>()
</script>

<template>
  <div class="filter-section">
    <button
      :class="{ active: currentFilter === 'all' }"
      class="filter-btn"
      @click="emit('updateFilter', 'all')"
    >
      全て
    </button>
    <button
      :class="{ active: currentFilter === 'active' }"
      class="filter-btn"
      @click="emit('updateFilter', 'active')"
    >
      進行中
    </button>
    <button
      :class="{ active: currentFilter === 'completed' }"
      class="filter-btn"
      @click="emit('updateFilter', 'completed')"
    >
      完了済み
    </button>
    <span class="count">{{ activeTodosCount }} 件のタスクが残っています</span>
  </div>
</template>

<style scoped>
.filter-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: #ecf0f1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 0.9rem;
}

.filter-btn:hover {
  background: #d5dbdb;
}

.filter-btn.active {
  background: #3498db;
  color: white;
}

.count {
  margin-left: auto;
  color: #7f8c8d;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .count {
    margin-left: 0;
    width: 100%;
  }
}
</style>
