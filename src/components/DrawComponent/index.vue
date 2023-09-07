<template>
  <el-drawer
    v-if="drawerVisible"
    :model-value="drawerVisible"
    :direction="direction"
    :close-on-click-modal="false"
    :before-close="handleClose"
    custom-class="drawer-component"
  >
    <template #header>
      <div class="demo-drawer__header">
        <span class="left-title c-flex c-items-center"> <i class="left-icon"></i>{{ title }}</span>
      </div>
    </template>
    <template #default>
      <div class="demo-drawer__body">
        <slot></slot>
      </div>
    </template>
    <template #footer>
      <div class="demo-drawer__footer">
        <el-button plain @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import type { EpPropMergeType } from 'element-plus/es/utils/vue/props/types'
const props = defineProps({
  // 是否显示抽屉
  drawerVisible: {
    type: Boolean,
    default: false
  },
  // 抽屉大小
  size: {
    type: [Number, String],
    default: '65%'
  },
  // 抽屉打开方向
  direction: {
    type: String as any,
    default: 'rtl'
  },
  // 抽屉标题
  title: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['closeDrawer'])
// 取消抽屉事件
const handleClose = () => {
  emits('closeDrawer')
}
</script>
<style lang="scss">
.drawer-component {
  .el-drawer__header {
    padding-right: 30px;
  }
}
</style>
<style lang="scss" scoped>
.drawer-component {
  .demo-drawer__header,
  .demo-drawer__body {
    padding: 0 20px;
  }

  .left-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
  }

  .left-icon {
    display: inline-block;
    background: $blue;
    width: 4px;
    height: 26px;
    margin-right: 12px;
    border-radius: 2px;
  }

  .demo-drawer__footer {
    margin-bottom: 30px !important;
    margin-right: 20px !important;
  }
}
</style>
