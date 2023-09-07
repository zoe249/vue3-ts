<template>
  <div class="tabs-wrap">
    <div class="tabs-left">
      <!--主页图标-->
      <el-tooltip content="首页">
        <router-link to="/" class="homeIcon">
          <i class="iconfont icon-shouye3"></i>
        </router-link>
      </el-tooltip>
      <el-divider direction="vertical" style="margin-right: 20px" />
    </div>
    <!--tabs-->
    <div class="tabs-center">
      <el-tabs
        v-model="currentTab"
        class="header-tabs"
        @tab-click="clickTab"
        @tab-remove="removeTab"
        @contextmenu.prevent="openRightMenu($event)"
      >
        <template v-for="(item, index) in visitedViews" :key="index">
          <el-tab-pane
            v-if="item.fullPath !== '/index' && item.meta.title"
            :label="item.meta.title"
            :name="item.fullPath"
            closable
          ></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li v-show="visitedViews.length > 2" @click="closeOthersTags">
        <i-ep-circle-close style="width: 1em; height: 1em" /> 关闭其他
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <i-ep-back style="width: 1em; height: 1em" /> 关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <i-ep-right style="width: 1em; height: 1em" /> 关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <i-ep-circle-close style="width: 1em; height: 1em" /> 全部关闭
      </li>
    </ul>

    <!--刷新图标-->
    <!-- <div class="tabs-right tab-refresh" @click="refreshPage">
        <i class="iconfont icon-shuaxin2"></i>
        <span>刷新</span>
      </div> -->
  </div>
</template>
<script setup lang="ts">
import useTagsViewStore from '@/store/modules/tagsView'
import { ComponentInternalInstance } from 'vue'
const props = defineProps({
  isCollapse: {
    // 菜单是否展开收起
    type: Boolean,
    default: false
  }
})
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const visitedViews = computed(() => useTagsViewStore().visitedViews)
const visible = ref(false)
const currentTab = ref()
const top = ref(0)
const left = ref(0)
const selectedTag = ref<any>({})

// 点击
const clickTab = (tag: any) => {
  router.push({ path: tag.props.name })
  currentTab.value = route.fullPath
}

// 刷新
const refreshPage = () => {
  router.replace({ path: '/refresh' })
}

// 右键
const openRightMenu = (e: {
  target: { getAttribute: (arg0: string) => string }
  clientX: number
  clientY: number
}) => {
  const domId = e.target.getAttribute('id')
  if (!domId) return
  const viewId = domId.replace('tab-', '')
  const menuMinWidth = 105
  const offsetLeft = proxy?.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = proxy?.$el.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const l = e.clientX - offsetLeft + 15 // 15: margin right
  const extraWidth = props.isCollapse ? 50 : 200
  if (l > maxLeft) {
    left.value = maxLeft + extraWidth
  } else {
    left.value = l + extraWidth
  }

  top.value = e.clientY + 10
  visible.value = true
  selectedTag.value = viewId
}

// 新增tag
const addTags = () => {
  const { name } = route
  if (name) {
    useTagsViewStore().addView(route)
  }
  return false
}

// 删除tag
const removeTab = (view: any) => {
  // 删除当前打开页面的tag, 跳转到上一个tag
  if (view === router.currentRoute.value.path) {
    const index = visitedViews.value.findIndex((v: { path: any }) => v.path === view)
    if (visitedViews.value.length === 1) {
      currentTab.value = '/index'
    } else if (index === 0) {
      currentTab.value = visitedViews.value[index + 1].path
    } else {
      currentTab.value = visitedViews.value[index - 1].path
    }

    router.push({ path: currentTab.value })
  }
  useTagsViewStore().delView(view)
}

const isFirstView = () => {
  try {
    return selectedTag.value === visitedViews.value[1].fullPath || selectedTag.value.fullPath === '/index'
  } catch (err) {
    return false
  }
}
const isLastView = () => {
  try {
    return selectedTag.value === visitedViews.value[visitedViews.value.length - 1].fullPath
  } catch (err) {
    return false
  }
}
const closeRightTags = () => {
  router.push(selectedTag.value)
  proxy?.$tab.closeRightPage(selectedTag.value).then((visitedViews: any) => {
    if (!visitedViews.find((i: { fullPath: string }) => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
const closeLeftTags = () => {
  router.push(selectedTag.value)
  proxy?.$tab.closeLeftPage(selectedTag.value).then((visitedViews: any) => {
    if (!visitedViews.find((i: { fullPath: string }) => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
const closeOthersTags = () => {
  router.push(selectedTag.value)
  proxy?.$tab.closeOtherPage(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}
const closeAllTags = (view: any) => {
  router.push({ path: '/index' })
  proxy?.$tab.closeAllPage().then((res: any) => {
    toLastView(res.visitedViews, view)
  })
}

const toLastView = (visitedViews: any[], view?: any) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

const closeMenu = () => {
  visible.value = false
}

const moveToCurrentTag = () => {
  nextTick(() => {
    for (const r of visitedViews.value) {
      if (r.path === route.path) {
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          useTagsViewStore().updateVisitedView(route)
        }
      }
    }
  })
}

onMounted(() => {
  addTags()
})

watch(
  route,
  () => {
    addTags()
    moveToCurrentTag()
    currentTab.value = route.fullPath
  },
  {
    deep: true,
    immediate: true
  }
)
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
</script>
<style scoped lang="scss">
.tabs-wrap {
  width: 100%;
  height: 40px;
  background-color: #fff;
  display: flex;
  align-items: center;

  .tabs-left {
    max-width: 150px;
    height: 100%;
    display: flex;
    align-items: center;
    .homeIcon {
      margin: 0 8px 0 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-color-primary);
    }
    .tabs-bread {
      width: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999999;
      font-size: 14px;
    }
  }
  .tabs-center {
    width: calc(100% - 80px);
  }
  .tabs-right {
    width: 72px;
    height: 100%;
    background-color: #dddddd;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
      margin-right: 5px;
    }
  }
}
:deep(.el-tabs__item) {
  font-size: 14px;
  padding: 0 10px;
  font-weight: 400;
}
:deep(.el-tabs__nav-wrap:after) {
  display: none;
}
:deep(.el-tabs__active-bar) {
  display: none;
}
:deep(.el-tabs__header) {
  margin: 0;
}
:deep(.el-tabs__nav .is-active .is-icon-close) {
  border-color: $--color-primary;
}
:deep(.is-icon-close) {
  font-size: 12px;
  vertical-align: -2px;
  &:hover {
    background-color: transparent;
    color: #333;
  }
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}
.tab-refresh {
  color: $font-color;
  font-size: 14px;
}
</style>
