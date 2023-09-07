import api from '@/api/index'
export const login = <T>(data?: unknown) => {
  return api.get<T>('/mock/api/login', data)
}
