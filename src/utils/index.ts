/**
 * 函数防抖
 * @param func 回调函数
 * @param wait 延迟执行的时间
 * @param immediate 是否立即执行一次
 */
export function debounce(func: () => void, wait: number, immediate = true) {
  let timeout: any, result: any
  return function (this: any) {
    const self = this
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(self, args as any)
    } else {
      timeout = setTimeout(function () {
        func.apply(self, args as any)
      }, wait)
    }
    return result
  }
}
/**
 * 表格时间格式化
 * @param cellValue 传入的时间Date格式
 * @param isDate 是否返回年月日格式
 */
export function formatDate(cellValue: Date | string, isDate: boolean) {
  if (cellValue == null || cellValue == '') return ''
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  if (isDate) {
    return year + '-' + month + '-' + day
  } else {
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  }
}
/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params: any) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            params = propName + '[' + key + ']'
            const subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}
/**
 * 返回项目路径
 * @param p String
 * @returns
 */
export function getNormalPath(p: string) {
  if (p.length === 0 || !p || p == 'undefined') {
    return p
  }
  const res = p.replace('//', '/')

  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}
/**
 * 获取url query 参数
 * @param {string} key
 * @returns {string}
 */

export function getQuery(key: string | number) {
  const search = window.location.search
  /* istanbul ignore if */
  if (search) {
    const index = search.indexOf('?')
    const queryArr = search.substring(index + 1, search.length).split('&')
    const obj: any = {}
    for (const item of queryArr) {
      const arr = item.split('=')
      obj[arr[0]] = arr[1]
    }
    return obj[key]
  }
  return ''
}
/**
 * 表单重制
 * @param refName string
 */
export function resetForm(this: any, refName: string) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}
/**
 * 拼接编码和名称函数
 * @param code 编码
 * @param name 名称
 * @returns 编码-名称
 */
export function spliceCodeName(code: string, name: string) {
  if ((code || code == '0') && name) {
    return code + ' - ' + name
  } else if (code || code == '0') {
    return code
  } else if (name) {
    return name
  } else {
    return ''
  }
}
/**
 * 深拷贝
 * @param obj 拷贝的原对象
 * @returns 拷贝后的对象
 */
export const deepObjClone = (obj: any) => {
  const weakMap = new WeakMap()
  function clone(obj: any) {
    if (obj == null) {
      return obj
    }
    if (obj instanceof Date) {
      return new Date(obj)
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj)
    }
    if (typeof obj !== 'object') return obj

    if (weakMap.get(obj)) {
      return weakMap.get(obj)
    }
    const copy = new obj.constructor()
    weakMap.set(obj, copy)
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        copy[key] = clone(value)
      }
    }
    return copy
  }
  return clone(obj)
}
