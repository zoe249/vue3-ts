const sessionCache = {
  set(key: string | null, value: string | null) {
    if (!sessionStorage) {
      return
    }
    if (key != null && value != null) {
      sessionStorage.setItem(key, value)
    }
  },
  get(key: string | null) {
    if (!sessionStorage) {
      return null
    }
    if (key == null) {
      return null
    }
    return sessionStorage.getItem(key)
  },
  setJSON(key: string | null, jsonValue: null) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue))
    }
  },
  getJSON(key: any) {
    const value = this.get(key)
    if (value != null) {
      return JSON.parse(value)
    }
  },
  remove(key: string) {
    sessionStorage.removeItem(key)
  }
}
const localCache = {
  set(key: string | null, value: string | null) {
    if (!localStorage) {
      return
    }
    if (key != null && value != null) {
      localStorage.setItem(key, value)
    }
  },
  get(key: string | null) {
    if (!localStorage) {
      return null
    }
    if (key == null) {
      return null
    }
    return localStorage.getItem(key)
  },
  setJSON(key: string, jsonValue: null) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue))
    }
  },
  getJSON(key: string) {
    const value = this.get(key)
    if (value != null) {
      return JSON.parse(value)
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
  }
}

const cookieCache = {
  /**
   *  存cookie
   *
   * @param {String} key cookie的键
   * @param {string} value cookie的值
   * @param {Number} interval cookie存储的时间,精确到天
   * @param {String} path cookie存储的路径
   */
  set(key: any, value: any, interval: number, path = '/') {
    const d = new Date()
    const duration = d.getTime() + interval * 24 * 60 * 60 * 1000
    d.setTime(duration)
    document.cookie = `${key}=${value};expires=${d.toDateString()};path=${path}`
  },
  /**
   *  取cookie
   *
   * @param {String} name cookie的键
   */
  get(name: string) {
    const strcookie = document.cookie
    if (!strcookie.length) return
    const arrcookie = strcookie.split('; ') // 不要去掉这个空格，取的时候有用
    // 遍历匹配
    for (let i = 0; i < arrcookie.length; i++) {
      const arr = arrcookie[i].split('=')
      if (arr[0] === name) {
        return arr[1]
      }
    }
    return ''
  },
  /**
   *  清所有cookie
   *
   */
  clear() {
    const cookieArr = document.cookie.split(';')
    cookieArr.forEach((item) => {
      const [key] = item.split('=')
      const d = new Date()
      d.setDate(d.getDate() - 1)
      document.cookie = `${key}='';expires=${d};path=/`
    })
  }
}

export default {
  /**
   * 会话级缓存
   */
  session: sessionCache,
  /**
   * 本地缓存
   */
  local: localCache,
  cookie: cookieCache
}
