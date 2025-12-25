export const API_BASE_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001'
export const API_ENDPOINTS = {
  todos: `${API_BASE_URL}/api/todos`,
} as const
