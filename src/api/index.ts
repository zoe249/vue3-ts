// 封装请求方法
import axios from './axios'
import type { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
const instance = axios()

export default {
  get<T>(url: string, params?: unknown, headers?: AxiosRequestHeaders): Promise<Response<T>> {
    const options: AxiosRequestConfig = {}
    if (params) {
      options.params = params
    }
    if (headers) {
      options.headers = headers
    }
    return instance.get(url, options)
  },
  post<T>(
    url: string,
    data?: unknown,
    headers?: AxiosRequestHeaders,
    params?: unknown
  ): Promise<Response<T>> {
    const options: AxiosRequestConfig = {}
    if (headers) {
      options.headers = headers
    }
    if (params) {
      options.params = params
    }
    return instance.post(url, data, options)
  },
  put<T>(url: string, params?: unknown, headers?: AxiosRequestHeaders): Promise<Response<T>> {
    const options: AxiosRequestConfig = {}
    if (headers) {
      options.headers = headers
    }
    return instance.put(url, params, options)
  },
  delete<T>(url: string, params?: unknown, headers?: AxiosRequestHeaders): Promise<Response<T>> {
    const options: AxiosRequestConfig = {}
    if (params) {
      options.params = params
    }
    if (headers) {
      options.headers = headers
    }
    return instance.delete(url, options)
  }
}
