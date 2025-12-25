import type { Todo, FilterType } from '~/types/todo'
import { API_ENDPOINTS } from '~/config/api'

export const useTodos = () => {
  const todos = useState<Todo[]>('todos', () => [])
  const filter = useState<FilterType>('filter', () => 'all')
  const loading = useState('loading', () => false)
  const error = useState<string | null>('error', () => null)

  // Computed properties
  const filteredTodos = computed(() => {
    if (filter.value === 'active') {
      return todos.value.filter((todo) => !todo.completed)
    }
    if (filter.value === 'completed') {
      return todos.value.filter((todo) => todo.completed)
    }
    return todos.value
  })

  const activeTodosCount = computed(() => {
    return todos.value.filter((todo) => !todo.completed).length
  })

  // API functions
  const fetchTodos = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await $fetch<Todo[]>(API_ENDPOINTS.todos)
      todos.value = data
    } catch (e) {
      error.value = 'TODOの取得に失敗しました'
      console.error('Error fetching todos:', e)
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (text: string) => {
    if (!text.trim()) return

    try {
      loading.value = true
      error.value = null
      const todo = await $fetch<Todo>(API_ENDPOINTS.todos, {
        method: 'POST',
        body: { text: text.trim() },
      })
      todos.value.push(todo)
    } catch (e) {
      error.value = 'TODOの追加に失敗しました'
      console.error('Error adding todo:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const removeTodo = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await $fetch(`${API_ENDPOINTS.todos}/${id}`, {
        method: 'DELETE',
      })
      todos.value = todos.value.filter((todo) => todo.id !== id)
    } catch (e) {
      error.value = 'TODOの削除に失敗しました'
      console.error('Error deleting todo:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return

    try {
      loading.value = true
      error.value = null
      const updated = await $fetch<Todo>(`${API_ENDPOINTS.todos}/${id}`, {
        method: 'PUT',
        body: { completed: !todo.completed },
      })
      Object.assign(todo, updated)
    } catch (e) {
      error.value = 'TODOの更新に失敗しました'
      console.error('Error toggling todo:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateTodo = async (id: string, text: string) => {
    if (!text.trim()) return

    try {
      loading.value = true
      error.value = null
      const updated = await $fetch<Todo>(`${API_ENDPOINTS.todos}/${id}`, {
        method: 'PUT',
        body: { text: text.trim() },
      })
      const todo = todos.value.find((t) => t.id === id)
      if (todo) {
        Object.assign(todo, updated)
      }
    } catch (e) {
      error.value = 'TODOの更新に失敗しました'
      console.error('Error updating todo:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const setFilter = (newFilter: FilterType) => {
    filter.value = newFilter
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    todos: readonly(todos),
    filter: readonly(filter),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    filteredTodos,
    activeTodosCount,

    // Actions
    fetchTodos,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    setFilter,
    clearError,
  }
}
