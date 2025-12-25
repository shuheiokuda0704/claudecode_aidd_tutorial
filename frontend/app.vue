<script setup lang="ts">
const {
  filter,
  error,
  filteredTodos,
  activeTodosCount,
  fetchTodos,
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodo,
  setFilter,
} = useTodos()

// 初回読み込み時にTODOを取得
onMounted(() => {
  fetchTodos()
})
</script>

<template>
  <div class="container">
    <header>
      <h1>TODO App</h1>
      <p class="subtitle">Nuxt 4 + PostgreSQL バックエンド付きTODOアプリ</p>
    </header>

    <ErrorMessage :message="error" />

    <div class="todo-app">
      <TodoInput @add="addTodo" />

      <TodoFilters
        :current-filter="filter"
        :active-todos-count="activeTodosCount"
        @update-filter="setFilter"
      />

      <TodoList
        :todos="filteredTodos"
        :filter="filter"
        @toggle="toggleTodo"
        @remove="removeTodo"
        @update="updateTodo"
      />
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.todo-app {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>
