import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from './staticRoutes'
import useMemuStore from '@/store/modules/menu'
import useUserStore from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login']
const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
NProgress.configure({ showSpinner: false })
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (!useMemuStore().isSetMenu) {
        addRouterFn(to, next)
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
function addRouterFn(to: any, next: (arg0: any) => void) {
  useMemuStore()
    .getRouter()
    .then((accessRoutes: any) => {
      accessRoutes.forEach((item: any) => {
        router.addRoute(item) // 动态添加可访问路由表
      })
      useMemuStore().changeisSetMenu(true)
      next({ ...to, replace: true })
    })
}
router.afterEach(() => {
  NProgress.done()
})
export default router
