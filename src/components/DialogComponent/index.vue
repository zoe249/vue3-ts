<template>
  <el-dialog
    :model-value="dialogVisible"
    draggable
    destroy-on-close
    :align-center="true"
    :close-on-click-modal="false"
    :title="title"
    :width="width"
    @close="cancelDialog"
  >
    <slot></slot>
    <template #footer>
      <div class="dialog-footer">
        <el-button plain @click="cancelDialog">取消</el-button>
        <el-button type="primary" :disabled="disabled" @click="saveDialog">{{ btnText }}</el-button>
        <el-button v-if="otherBtnName" type="primary" @click="handleOtherDialog">{{
          otherBtnName
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  // 是否显示对话框
  dialogVisible: {
    type: Boolean,
    default: false
  },
  // 对话框宽度
  width: {
    type: [String, Number],
    default: '40%'
  },
  // 对话框标题
  title: {
    type: String,
    default: '标题'
  },
  // 按钮文字
  btnText: {
    type: String,
    default: '保存'
  },
  // 除了 保存/取消 按钮的其他按钮文字
  otherBtnName: {
    type: String,
    default: null
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancelDialog', 'saveDialog', 'handleOtherDialog', 'update:dialogVisible'])
const cancelDialog = () => {
  emit('cancelDialog')
}
const saveDialog = () => {
  emit('saveDialog')
}
const handleOtherDialog = () => {
  emit('handleOtherDialog')
}
</script>

<style lang="scss">
/* 覆盖dialog样式 */
.el-dialog {
  border-radius: 8px !important;
  /*margin:0 !important;
    position:absolute!important;
    top:50%!important;
    left:50%!important;
    transform:translate(-50%,-50%)!important;*/
}
.el-dialog .el-dialog__header {
  color: #fff !important;
  background-color: $--color-primary;
  width: 100%;
  border-radius: 8px 8px 0 0 !important;
  height: 32px;
  line-height: 32px;
  padding: 0;
}
.el-dialog__title {
  color: #fff !important;
  margin-left: 15px;
  font-size: 14px !important;
}
.el-dialog__body {
  flex: 1;
  overflow: auto;
  padding: 20px 40px;
}
.el-dialog__headerbtn {
  width: 34px !important;
  height: 24px !important;
}
.el-dialog__headerbtn .el-dialog__close {
  color: #fff !important;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  .el-button {
    width: 96px;
    height: 32px;
    margin: 0 15px;
  }
}
</style>
