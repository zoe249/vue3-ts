<template>
  <div class="sidebar-wrap">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :unique-opened="true"
        :collapse-transition="false"
        background-color="#06172C"
        text-color="#fff"
        mode="vertical"
      >
        <sidebar-item
          v-for="(item, index) in sidebarRouters"
          :key="item.path + index"
          :item="item"
          :base-path="item.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'

import useAppStore from '@/store/modules/app'
import usePermissionStore from '@/store/modules/menu'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.topbarRouters)
const isCollapse = computed(() => !appStore.sidebar.opened)

const activeMenu = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>
<style lang="scss" scoped>
.sidebar-wrap {
  background: $mobile-menu-color;
}
</style>
