export const getApiEndpoints = (apiUrl: string) =>
  ({
    todos: `${apiUrl}/api/todos`,
  }) as const
