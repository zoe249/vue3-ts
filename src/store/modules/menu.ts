import cache from '@/plugins/cache'
import { deepObjClone } from '@/utils/index'
import { staticRoutes } from '@/router/staticRoutes'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'
const modules = import.meta.glob('../../views/**/*.vue')
const useMenuStore = defineStore('permission', {
  state: () => ({
    isSetMenu: false,
    currentPath: null,
    topbarRouters: [],
    sidebarRouters: [],
    rewriteRoutes: []
  }),
  actions: {
    setCurrentPath(obj: any) {
      this.currentPath = obj
    },
    changeisSetMenu(isSet: boolean) {
      this.isSetMenu = isSet
    },
    setTopbarRoutes(routes: any) {
      this.topbarRouters = routes
    },
    setSidebarRouters(routes: any) {
      this.sidebarRouters = routes
    },
    setreWriteRouters(routes: any) {
      this.rewriteRoutes = routes
    },
    handleRouters(menus: any): any {
      // 存在用户没有任何权限时 menus 为 undefined 的情况
      if (!menus) {
        menus = []
      }
      const sdata = deepObjClone(menus)
      const rData = deepObjClone(menus)
      const sidebarRoutes = filterAsyncRouter(sdata)
      const rewriteRoutes = filterAsyncRouter(rData, false, true)
      const defaultRoutes = deepObjClone(sidebarRoutes)
      this.setTopbarRoutes(defaultRoutes)
      this.setSidebarRouters(staticRoutes.concat(sidebarRoutes))
      this.setreWriteRouters(rewriteRoutes)
      return rewriteRoutes
    },
    getRouter() {
      return new Promise((resolve) => {
        const menus = cache.local.getJSON('menuRoutes')
        if (menus && menus.length) {
          resolve(this.handleRouters(menus))
        } else {
          resolve(this.getRouterData())
        }
      })
    },
    getRouterData() {
      //TODO 向后端请求路由数据
      return new Promise((resolve) => {
        setTimeout(() => {
          const menu = [
            {
              name: 'Test',
              path: '/test',
              hidden: false,
              redirect: 'noRedirect',
              component: 'Layout',
              alwaysShow: true,
              meta: { title: '测试菜单1', icon: 'icon-wuliuxinxi', noCache: false },
              children: [
                {
                  name: 'Child_Test',
                  path: 'child_test',
                  hidden: false,
                  redirect: 'noRedirect',
                  component: 'ParentView',
                  alwaysShow: true,
                  meta: { title: ' 子菜单1', icon: 'icon-wuliuxinxi', noCache: false },
                  children: [
                    {
                      name: 'Test1',
                      path: 'test1',
                      hidden: false,
                      component: 'test/child_test/test1/index',
                      meta: { title: '子菜单2', icon: '#', noCache: false }
                    },
                    {
                      name: 'Test2',
                      path: 'test2',
                      hidden: false,
                      component: 'test/child_test/test2/index',
                      meta: { title: '子菜单3', icon: '#', noCache: false }
                    }
                  ]
                }
              ]
            }
          ] as any
          cache.local.setJSON('menuRoutes', menu)
          resolve(this.handleRouters(menu))
        }, 200)
      })
    }
  }
})
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route: any) => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}
function filterChildren(childrenMap: any, lastRouter: any = false) {
  let children: any[] = []
  childrenMap.forEach((el: { children: any; component: string; path: string }, index: any) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c: any) => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}
export const loadView = (view: string) => {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = modules[path]
    }
  }
  return res
}
export default useMenuStore
