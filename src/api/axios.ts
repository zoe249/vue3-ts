import axios from 'axios'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { tansParams } from '@/utils/index'
import errorCode from '@/utils/errorCode'
const http = axios.create({
  timeout: 30000
})
// 设置 post、put 默认 Content-Type
http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
http.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8'
// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
      config.headers!['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method == 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error) => Promise.reject(error)
)
// 添加响应拦截器
http.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = Number(res.data.code) || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res
    }
    if (code === 401) {
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElMessage.error(msg)
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage.warning(msg)
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElMessage.error(msg)
      return Promise.reject(res.data)
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    const erText: string = error.toString()
    if (erText.search('Network Error') != -1) {
      ElMessage.error('后端接口连接异常')
    } else if (erText.search('timeout') != -1) {
      ElMessage.error('系统接口请求超时')
    } else if (error?.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('请求错误')
    }
    return Promise.reject(error)
  }
)
/**
 * 创建统一封装过的 axios 实例
 * @return {AxiosInstance}
 */
export default function () {
  return http
}
