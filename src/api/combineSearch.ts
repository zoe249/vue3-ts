/**
 * @file 组合查询方案相关接口
 */
import api from '@/api/index'
import { organizationService } from '@/utils/apiConfig'

// 查询方案信息
export function queryPlan<T>(data: unknown) {
  return api.get<T>(`${organizationService}queryPlan`, data)
}

// 根据方案编码查询方案信息
export function queryViewById<T>(data: unknown) {
  return api.get<T>(`${organizationService}queryPlan/`, data)
}

// 添加查询方案
export function addQueryPlan<T>(data: unknown) {
  return api.post<T>(`${organizationService}queryPlan`, data)
}

// 修改查询方案信息
export function editQueryPlan<T>(id: string, data: unknown) {
  return api.put<T>(`${organizationService}queryPlan/${id}`, data)
}

// 删除查询方案信息
export function deleteQueryPlan<T>(id: string) {
  return api.delete<T>(`${organizationService}/queryPlan/${id}`)
}
