import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css'
import router from './router'
import store from './store'
import directive from './directive/index'
import 'element-plus/es/components/message/style/css'
import 'element-plus/theme-chalk/el-message-box.css'
import './assets/styles/index.scss'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
// 全局消息提示
import msg from '@/utils/modal'
// 全局公共接口
import api from './api/commonApi'
// 右键菜单
import tab from './plugins/tab'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: typeof api
    $message: typeof msg
    $tab: typeof tab
  }
}

const app = createApp(App)
app.config.globalProperties.$api = api
app.config.globalProperties.$message = msg
app.config.globalProperties.$tab = tab
app.use(router).use(store)
directive(app)
if (getToken()) {
  useUserStore()
    .getInfoData()
    .then(() => {
      app.mount('#app')
    })
} else {
  app.mount('#app')
}
