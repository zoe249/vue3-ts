<template>
  <div class="nav c-flex c-justify-between c-items-center">
    <div class="nav-logo c-flex c-items-center">
      <div class="logo-box"><img :src="logo" alt="logo" /></div>
      <div>
        <div class="logo-text1">{{ title }}</div>
      </div>
    </div>
    <div class="nav-menu c-flex c-items-center">
      <template v-for="(item, index) in menus" :key="index">
        <section :class="{ 'menu-active': checkSelected(item) }" class="menu-tab" @click="menuTabClick(item)">
          <span class="menu-tab-item">{{ item.meta.title }}</span>
          <span class="menu-border"></span>
        </section>
      </template>
    </div>
    <div class="nav-user c-flex c-items-center">
      <div class="c-flex c-items-center">
        <el-avatar class="avator-box" :src="userStore?.avatar" />
        <el-dropdown style="cursor: pointer" @command="handleCommand">
          <span class="el-dropdown-link items-center text-white">
            {{ userStore?.nickName }}
            <i class="iconfont icon-jiantoudown ml5"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu :hide-on-click="false">
              <el-dropdown-item command="logout">
                <i class="iconfont icon-infofill"></i>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <div style="height: 54px"></div>
</template>
<script setup lang="ts" name="navbar">
import { ElMessageBox } from 'element-plus'
import useUserStore from '@/store/modules/user'
import logo from '@/assets/logo/logo.png'
import { PropType } from 'vue'

const userStore = useUserStore()

const props = defineProps({
  menus: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const emit = defineEmits(['clickTab'])

const router = useRouter()
const route = useRoute()
const title = import.meta.env.VITE_APP_TITLE

// 点击一级菜单时， 获取当前模块下的第一个子菜单的path路径（二级或者三级）

const getFirstNode = (tree: any) => {
  let pathStr = ''
  const getPathFn = (str: string, item: { path: any; children: any[] }) => {
    if (item.path) {
      pathStr = str + item.path + '/'
    }
    if (item.children) {
      getPathFn(pathStr, item.children[0])
    }
  }
  getPathFn(pathStr, tree)
  return pathStr
}

// 点击一级菜单
const menuTabClick = (item: any) => {
  let path = getFirstNode(item)
  path = path.substring(0, path.length - 1)
  router.push(path)
}

// 判断当前菜单是否属于一级菜单
const checkSelected = (item: any) => {
  let reg = /([^/]*\/[^/]*)\/.*/
  const str = route.fullPath.replace(reg, '$1')
  if (isActiveMenu(item.path, str)) {
    return true
  }
  return false
}
// 是否是当前菜单模块
const isActiveMenu = (curPath: string, menuItemPath: string) => {
  if (!curPath || !menuItemPath) {
    return false
  }
  return curPath === menuItemPath || new RegExp(`^${menuItemPath}/`, 'ig').test(curPath)
}
const logout = () => {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = '/login'
      })
    })
    .catch((e) => e)
}
// 用户下拉命令
const handleCommand = (command: string) => {
  if (command === 'logout') {
    // 退出
    logout()
  }
}
</script>
<style lang="scss" scoped>
.nav {
  background: #06172c;
  height: 54px;
  color: #ddd;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9;
  padding: 0 16px;
  box-sizing: border-box;
  &-logo {
    .logo-box {
      width: 32px;
      height: 33px;
      margin-right: 15px;
      img {
        width: 100%;
      }
    }
    .logo-text1 {
      font-size: 22px;
      white-space: nowrap;
      font-weight: 600;
      color: #fff;
    }
  }
  &-menu {
    .menu-tab {
      margin: 0 28px;
      cursor: pointer;
      &-item {
        display: block;
        padding: 14px 0 10px 0;
      }
      &:hover {
        color: #fff;
        font-weight: 600;
      }
    }
    .menu-border {
      display: block;
      top: 26px;
      left: 0;
      right: 0;
      background-color: $nav-menu-background;
      border: 2px solid $nav-menu-background;
      border-radius: 4px;
    }
    .menu-tab-item {
      white-space: nowrap;
    }

    .menu-active {
      .menu-tab-item {
        color: #fff;
        font-weight: 600;
      }
      .menu-border {
        background-color: $--color-primary;
        border: 2px solid $--color-primary;
      }
    }
  }
  &-user {
    color: #fff;
    .avator-box {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }

    .icon-jiantoudown {
      font-size: 12px;
    }
  }
}
.text-white {
  color: #fff;
}
</style>
