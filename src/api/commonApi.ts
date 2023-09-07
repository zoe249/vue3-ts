import api from './index'
export default {
  getList<T>(data?: unknown) {
    return api.post<T>('/mock/api/getList', data)
  },
  addForm<T>(data: unknown) {
    return api.post<T>('/mock/api/addForm', data)
  },
  queryPlan<T>(data: unknown) {
    return api.get<T>('/mock/api/queryPlan', data)
  }
}
