<template>
  <div v-if="device === 'desktop'">
    <navbar :menus="menus"></navbar>
    <side-bar :block-menu="blockMenu" :main-base-path="basePath"> </side-bar>
  </div>
  <div v-else :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebarStore.opened" class="drawer-bg" @click="handleClickOutside" />
    <m-sidebar v-if="sidebarStore.opened" class="sidebar-container" />
    <m-navbar></m-navbar>
    <m-app-main />
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

import Navbar from './components/Navbar.vue'
import SideBar from './components/Sidebar/index.vue'

import MNavbar from './mcomponents/Navbar.vue'
import MAppMain from './mcomponents/AppMain.vue'
import MSidebar from './mcomponents/Sidebar/index.vue'

import useMenuStore from '@/store/modules/menu'
import useAppStore from '@/store/modules/app'

const menuStore = useMenuStore()
const appStore = useAppStore()

const menus = computed(() => menuStore.topbarRouters)
const sidebarStore = computed(() => appStore.sidebar)
console.log('sidebarStore', sidebarStore)
const device = computed(() => appStore.device)
console.log('device', device)
const classObj = computed(() => ({
  hideSidebar: !sidebarStore.value.opened,
  openSidebar: sidebarStore.value.opened,
  withoutAnimation: sidebarStore.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

const blockMenu = ref([])
const basePath = ref()
const route = useRoute()
// 获取下级菜单模块, 获取一级path字符串，根据字符串获取当前path下的子菜单
const getMenuBlock = (path: string) => {
  let reg = /([^/]*\/[^/]*)\/.*/
  const str = path.replace(reg, '$1')
  basePath.value = str
  menus.value.forEach((item: any) => {
    if (item.children.length > 0) {
      if (item.path === str) {
        blockMenu.value = item.children
      }
    }
  })
}
watch(
  () => route.fullPath,
  (val) => {
    getMenuBlock(val)
  },
  {
    deep: true,
    immediate: true
  }
)

// mobile
const { width, height } = useWindowSize()

const WIDTH = 992

function handleClickOutside() {
  useAppStore().closeSideBar({ withoutAnimation: false })
}

watchEffect(() => {
  if (device.value === 'mobile') {
    useAppStore().closeSideBar({ withoutAnimation: false })
  }
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice('mobile')
    useAppStore().closeSideBar({ withoutAnimation: true })
  } else {
    useAppStore().toggleDevice('desktop')
  }
})

watch(
  () => route.fullPath,
  (val) => {
    useAppStore().closeSideBar({ withoutAnimation: false })
    getMenuBlock(val)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.sidebar-container {
  width: 200px;
  height: 100%;
  position: absolute;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  background: $mobile-menu-background;
}
</style>
