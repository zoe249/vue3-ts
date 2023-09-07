<template>
  <section class="section-box">
    <div id="main" class="page-frame" :style="isCollapse ? 'margin-left:60px' : 'margin-left:180px'">
      <tags-view :is-collapse="isCollapse"></tags-view>
      <app-main />
    </div>

    <div class="aside" :style="{ width: isCollapse ? '60px' : '180px' }">
      <el-menu
        class="menus"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        mode="vertical"
      >
        <el-scrollbar height="90%">
          <el-menu-item
            v-if="isHomeRoute"
            index="/index"
            class="menu-item-home"
            :class="isCollapse ? 'menu-item-collapse' : ''"
          >
            <i class="iconfont icon-shouye3 mr10"></i>
            <span class="menu-title"> 首页 </span>
          </el-menu-item>
          <template v-else>
            <sidebar-item
              v-for="(item, index) in blockMenu"
              :key="index"
              :item="item"
              :base-path="item.path"
              :main-base-path="mainBasePath"
            >
            </sidebar-item>
          </template>
        </el-scrollbar>
      </el-menu>
      <div class="collape-wrap" :style="{ width: isCollapse ? '60px' : '180px' }" @click="handleCollapse">
        <i class="iconfont" :class="!isCollapse ? 'icon-caidanshouqi ' : 'icon-caidanzhankai'"></i>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import SidebarItem from './SidebarItem.vue'
import AppMain from '../AppMain.vue'
import TagsView from '../TagsView/index.vue'
import { PropType } from 'vue'
const props = defineProps({
  blockMenu: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  mainBasePath: {
    type: String,
    default: ''
  }
})
const route = useRoute()
const isCollapse = ref(false)
const isHomeRoute = ref(false)
const activeMenu = ref()
// 展开收起
const handleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

watch(
  () => route.fullPath,
  (val) => {
    activeMenu.value = val
    isHomeRoute.value = val === '/index'
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.section-box {
  height: calc(100% - 54px);
  .aside {
    width: 180px;
    position: fixed;
    top: 54px;
    bottom: 0;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);

    .menus {
      padding-bottom: 20px;
      border: none;
      width: 100%;
      height: calc(100vh - 60px);
      .menu-item-home {
        padding: 0px 18px 0px 20px;
        box-sizing: border-box;
        height: 48px;
        cursor: pointer;
        border-left: 5px solid #fff;
      }
      .menu-item-collapse {
        overflow: hidden;
        :deep(.menu-title) {
          display: none;
        }
        :deep(.el-sub-menu__icon-arrow) {
          display: none;
        }
        :deep(.el-sub-menu__title) {
          border: none;
        }
      }
      .menu-item-home.is-active {
        border-left: 5px solid $blue;
        background: $light-blue;
        color: $blue;
      }
    }

    .collape-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      padding: 12px 18px;
      box-sizing: border-box;
      color: #666;
    }
    :deep(.el-menu--collapse .el-sub-menu__title .el-icon) {
      display: none;
    }
    :deep(.el-menu--collapse .menu-title) {
      display: none;
    }
  }
  .page-frame {
    height: 100%;
  }
}
</style>
