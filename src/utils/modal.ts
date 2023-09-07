import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus'

let loadingCount = 0
let loading: any
const startLoading = (text: string, dom: string) => {
  if (!(!loading && loadingCount === 0)) return
  if (dom) {
    loading = ElLoading.service({
      text: text || '请求数据中。。。',
      target: document.querySelector(dom) as HTMLElement
    })
  } else {
    loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)',
      text: text || '请求数据中。。。'
    })
  }
}
const endLoading = () => {
  loading.close()
  loading = null
}
export default {
  // 消息提示
  msg(content: string) {
    ElMessage.info(content)
  },
  // 错误消息
  msgError(content: string) {
    ElMessage.error(content)
  },
  // 成功消息
  msgSuccess(content: string) {
    ElMessage.success(content)
  },
  // 警告消息
  msgWarning(content: string) {
    ElMessage.warning(content)
  },
  // 弹出提示
  alert(content: string) {
    ElMessageBox.alert(content, '系统提示')
  },
  // 错误提示
  alertError(content: string) {
    ElMessageBox.alert(content, '系统提示', { type: 'error' })
  },
  // 成功提示
  alertSuccess(content: string) {
    ElMessageBox.alert(content, '系统提示', { type: 'success' })
  },
  // 警告提示
  alertWarning(content: string) {
    ElMessageBox.alert(content, '系统提示', { type: 'warning' })
  },
  // 通知提示
  notify(content: string) {
    ElNotification.info(content)
  },
  // 错误通知
  notifyError(content: string) {
    ElNotification.error(content)
  },
  // 成功通知
  notifySuccess(content: string) {
    ElNotification.success(content)
  },
  // 警告通知
  notifyWarning(content: string) {
    ElNotification.warning(content)
  },
  // 确认窗体
  confirm(content: string) {
    return ElMessageBox.confirm(content, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  // 提交内容
  prompt(content: string) {
    return ElMessageBox.prompt(content, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  // 打开遮罩层
  loading(text: string, dom: string) {
    if (loadingCount === 0) {
      startLoading(text, dom)
    }
    loadingCount++
  },
  // 关闭遮罩层
  closeLoading() {
    if (loadingCount <= 0) return
    loadingCount--
    if (loadingCount === 0) {
      endLoading()
    }
  }
}
