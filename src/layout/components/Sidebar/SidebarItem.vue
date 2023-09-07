<template>
  <div
    v-if="
      hasOneShowingChild(item.children, item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
      !item.alwaysShow
    "
  >
    <div v-if="onlyOneChild.meta" @click="menuTo(resolvePath(onlyOneChild.path, onlyOneChild.query))">
      <el-menu-item
        :index="mainBasePath + '/' + resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': true }"
        class="menu-item"
      >
        <i class="iconfont mr10" :class="onlyOneChild.meta.icon"></i>
        <template #title>
          <span class="menu-title" :title="hasTitle(onlyOneChild.meta.title)">
            {{ onlyOneChild.meta.title }}
          </span>
        </template>
      </el-menu-item>
    </div>
  </div>

  <el-sub-menu v-else ref="subMenu" :index="mainBasePath + '/' + resolvePath(item.path)">
    <template v-if="item.meta" #title>
      <i class="iconfont mr10" :class="item.meta.icon"></i>
      <span class="menu-title" :title="hasTitle(item.meta.title)">{{ item.meta.title }}</span>
    </template>
    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
      :main-base-path="mainBasePath"
    >
    </sidebar-item>
  </el-sub-menu>
</template>

<script setup lang="ts">
import { isExternal } from '@/utils/validate'
import { getNormalPath } from '@/utils/index'
import { PropType } from 'vue'

const props = defineProps({
  // route object
  item: {
    type: Object as PropType<any>,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  },
  mainBasePath: {
    type: String,
    default: ''
  }
})

const onlyOneChild = ref<any>({})
const router = useRouter()

const hasOneShowingChild = (children = [], parent: any) => {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter((item: any) => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

function resolvePath(routePath: string, routeQuery?: any): any {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery)
    return { path: getNormalPath(props.basePath + '/' + routePath), query: query }
  }
  return getNormalPath(props.basePath + '/' + routePath)
}

const menuTo = (path: string) => {
  router.push({ path: props.mainBasePath + '/' + path })
}

function hasTitle(title: string) {
  if (title.length > 5) {
    return title
  } else {
    return ''
  }
}
</script>
<style lang="scss" scoped>
.menu-item {
  box-sizing: border-box;
  height: 48px !important;
  line-height: 24px !important;
  padding: 0px 18px 0px 12px;
  box-sizing: border-box;
  cursor: pointer;
  border-left: 5px solid #fff;
  word-break: break-all;
  white-space: normal !important;
}
.menu-item.is-active {
  border-left: 5px solid $blue;
  background: $light-blue;
  color: $blue;
}
:deep(.el-menu) {
  overflow: hidden;
}
:deep(.el-sub-menu__title) {
  border-left: 5px solid #fff;
  height: 48px;
}
:deep(.is-active .el-sub-menu__title) {
  color: $blue;
}
:deep(.is-active) {
  color: $blue;
}

.el-menu-item:hover {
  background: #fff;
  border-left: 5px solid #fff;
  color: $blue;
}
</style>
