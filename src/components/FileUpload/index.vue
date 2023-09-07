<template>
  <div class="img-upload-wrap">
    <el-upload
      class="upload-demo"
      :action="action"
      :method="method"
      :multiple="multiple"
      :name="name"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      :disabled="disabled"
      :limit="limit"
      :auto-upload="autoUpload"
      :is-show-tip="isShowTip"
      :file-size="fileSize"
      :file-list="fileList"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
    >
      <!-- 插槽默认上传按钮，可自定义 -->
      <slot>
        <el-button>上传文件</el-button>
      </slot>
      <!-- 上传提示 -->
      <template v-if="isShowTip" #tip>
        <div class="el-upload__tip">
          请上传
          <span>
            大小不超过 <strong class="tip-color">{{ fileSize }}MB；</strong>
          </span>
          <span>
            格式为 <strong class="tip-color">{{ accept }}</strong>
          </span>
          的图片
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts" name="fileUpload">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadUserFile, UploadProps, UploadFile } from 'element-plus'
interface Propstype {
  action?: string // 上传地址
  method?: string // 上传的请求方法
  multiple?: boolean // 是否多选
  name?: string // 上传的文件字段名
  showFileList?: boolean // 是否显示上传文件列表 如果是头像置为false
  drag?: boolean // 是否启用拖拽上传
  accept?: string // 允许上传的文件类型
  disabled?: boolean // 是否禁用上传
  limit?: number // 上传个数限制
  autoUpload?: boolean // 是否自动上传
  isShowTip?: boolean //  是否显示提示
  fileSize?: number // 文件大小
  fileList?: UploadUserFile[] // 文件列表
}
const props = withDefaults(defineProps<Propstype>(), {
  action: '', // 根据业务实际上传地址填写
  method: 'post',
  multiple: false,
  name: 'file',
  showFileList: true,
  drag: false,
  limit: 5,
  accept: () => '.doc,.xls,.ppt,.txt,.pdf,.xlsx',
  disabled: false,
  autoUpload: true,
  isShowTip: true,
  fileSize: 5,
  fileList: [] as any
})
const emits = defineEmits(['handleSuccess'])
const handleBeforeUpload: UploadProps['beforeUpload'] = (uploadFile): any => {
  // 校验文件格式
  let accepts = props.accept
  if (accepts.length) {
    const fileName = uploadFile.name.split('.')
    const fileExt = fileName[fileName.length - 1]
    const isTypeOk = props.accept.indexOf(fileExt) >= 0
    if (!isTypeOk) {
      ElMessage.error(`文件格式不正确, 请上传${props.accept}格式文件!`)
      return false
    }
  }
  // 校验文件大小
  if (uploadFile.size) {
    let size = uploadFile.size / 1024 / 1024
    if (size > props.fileSize) {
      ElMessage.error(`请上传大小不超过 ${props.fileSize} MB的文件`)
      return false
    }
  }
}
const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
  console.log(uploadFile)
}
const handleSuccess: UploadProps['onSuccess'] = (res, uploadFile): any => {
  console.log(uploadFile)
  if (res.code !== '200') return ElMessage.error('上传失败，请重新上传！')
  emits('handleSuccess', res.data)
}
const handleError: UploadProps['onError'] = (uploadFile) => {
  ElMessage.error('上传失败，请重新上传!！')
}
const handleExceed = () => {
  ElMessage.warning(`上传文件数量不能超过 ${props.limit} 个!`)
}
</script>

<style scoped lang="scss">
.el-upload__tip {
  font-size: 12px;
}
.upload-demo {
  :deep(.el-upload-list) {
    // 图片列表大小
    .el-upload-list__item {
      width: 100px;
      height: 100px;
    }
  }
  // picture-card格式icon大小
  :deep(.el-upload) {
    width: 100px;
    height: 100px;
  }
}
.tip-color {
  color: #f56c6c;
}
</style>
