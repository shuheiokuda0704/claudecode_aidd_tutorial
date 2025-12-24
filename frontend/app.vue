<script setup lang="ts">
interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt?: string
  updatedAt?: string
}

type FilterType = 'all' | 'active' | 'completed'

const API_URL = 'http://localhost:3001/api/todos'

const newTodo = ref('')
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')
const editingId = ref<string | null>(null)
const editingText = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter(todo => !todo.completed)
  }
  if (filter.value === 'completed') {
    return todos.value.filter(todo => todo.completed)
  }
  return todos.value
})

const activeTodosCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length
})

// TODOリストを取得
const fetchTodos = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await $fetch<Todo[]>(API_URL)
    todos.value = data
  } catch (e) {
    error.value = 'TODOの取得に失敗しました'
    console.error('Error fetching todos:', e)
  } finally {
    loading.value = false
  }
}

// TODOを追加
const addTodo = async () => {
  if (!newTodo.value.trim()) return

  try {
    loading.value = true
    error.value = null
    const todo = await $fetch<Todo>(API_URL, {
      method: 'POST',
      body: { text: newTodo.value.trim() }
    })
    todos.value.push(todo)
    newTodo.value = ''
  } catch (e) {
    error.value = 'TODOの追加に失敗しました'
    console.error('Error adding todo:', e)
  } finally {
    loading.value = false
  }
}

// TODOを削除
const removeTodo = async (id: string) => {
  try {
    loading.value = true
    error.value = null
    await $fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    todos.value = todos.value.filter(todo => todo.id !== id)
  } catch (e) {
    error.value = 'TODOの削除に失敗しました'
    console.error('Error deleting todo:', e)
  } finally {
    loading.value = false
  }
}

// TODOの完了状態を切り替え
const toggleTodo = async (id: string) => {
  const todo = todos.value.find(t => t.id === id)
  if (!todo) return

  try {
    loading.value = true
    error.value = null
    const updated = await $fetch<Todo>(`${API_URL}/${id}`, {
      method: 'PUT',
      body: { completed: !todo.completed }
    })
    Object.assign(todo, updated)
  } catch (e) {
    error.value = 'TODOの更新に失敗しました'
    console.error('Error toggling todo:', e)
  } finally {
    loading.value = false
  }
}

const startEdit = (todo: Todo) => {
  editingId.value = todo.id
  editingText.value = todo.text
}

const cancelEdit = () => {
  editingId.value = null
  editingText.value = ''
}

// TODOを編集
const saveEdit = async (id: string) => {
  if (!editingText.value.trim()) {
    cancelEdit()
    return
  }

  try {
    loading.value = true
    error.value = null
    const updated = await $fetch<Todo>(`${API_URL}/${id}`, {
      method: 'PUT',
      body: { text: editingText.value.trim() }
    })
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      Object.assign(todo, updated)
    }
    cancelEdit()
  } catch (e) {
    error.value = 'TODOの更新に失敗しました'
    console.error('Error updating todo:', e)
  } finally {
    loading.value = false
  }
}

const handleKeydown = (e: KeyboardEvent, id: string) => {
  if (e.key === 'Enter') {
    saveEdit(id)
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}

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

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="todo-app">
      <div class="input-section">
        <input
          v-model="newTodo"
          type="text"
          placeholder="新しいTODOを入力..."
          @keydown.enter="addTodo"
          class="todo-input"
        />
        <button @click="addTodo" class="add-btn">追加</button>
      </div>

      <div class="filter-section">
        <button
          @click="filter = 'all'"
          :class="{ active: filter === 'all' }"
          class="filter-btn"
        >
          全て
        </button>
        <button
          @click="filter = 'active'"
          :class="{ active: filter === 'active' }"
          class="filter-btn"
        >
          進行中
        </button>
        <button
          @click="filter = 'completed'"
          :class="{ active: filter === 'completed' }"
          class="filter-btn"
        >
          完了済み
        </button>
        <span class="count">{{ activeTodosCount }} 件のタスクが残っています</span>
      </div>

      <ul class="todo-list">
        <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
          <div class="todo-content">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
              class="todo-checkbox"
            />
            <span
              v-if="editingId !== todo.id"
              :class="{ completed: todo.completed }"
              class="todo-text"
              @dblclick="startEdit(todo)"
            >
              {{ todo.text }}
            </span>
            <input
              v-else
              v-model="editingText"
              type="text"
              class="edit-input"
              @blur="saveEdit(todo.id)"
              @keydown="(e) => handleKeydown(e, todo.id)"
              ref="editInput"
            />
          </div>
          <div class="todo-actions">
            <button
              v-if="editingId !== todo.id"
              @click="startEdit(todo)"
              class="edit-btn"
            >
              編集
            </button>
            <button
              v-if="editingId === todo.id"
              @click="saveEdit(todo.id)"
              class="save-btn"
            >
              保存
            </button>
            <button
              v-if="editingId === todo.id"
              @click="cancelEdit"
              class="cancel-btn"
            >
              キャンセル
            </button>
            <button
              v-if="editingId !== todo.id"
              @click="removeTodo(todo.id)"
              class="delete-btn"
            >
              削除
            </button>
          </div>
        </li>
      </ul>

      <div v-if="filteredTodos.length === 0" class="empty-state">
        <p>{{ filter === 'all' ? 'TODOがありません' : filter === 'active' ? '進行中のTODOがありません' : '完了済みのTODOがありません' }}</p>
      </div>
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

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.todo-app {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

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

.todo-list {
  list-style: none;
}

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

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #95a5a6;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .input-section {
    flex-direction: column;
  }

  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .todo-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .count {
    margin-left: 0;
    width: 100%;
  }
}
</style>
