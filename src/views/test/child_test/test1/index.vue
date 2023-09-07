<template>
  <div>
    <img-upload :file-list="fileList"></img-upload>
    <div>
      <div v-hasPermi="permissionFilter('query')">菜单1</div>
      <page-header />
      <div>菜单1</div>
      <button @click="dialogVisible = true">对话框</button>
      <button @click="drawerVisible = true">抽屉</button>
      <!-- <bar-code text="bracode" :width="1.5" />
      <qr-code text="qrcode" @success="success" /> -->
      <dialog-component :dialog-visible="dialogVisible" />
      <draw-component :drawer-visible="drawerVisible" />
    </div>
  </div>
</template>

<script setup lang="ts" name="Test1">
import { permissionFilter } from '@/hooks/permissonFillter'
import ImgUpload from '@/components/ImgUpload/index.vue'
const success = () => console.log('创建成功')
let dialogVisible = ref(false)
let drawerVisible = ref(false)
const fileList = [
  {
    url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    name: 'xx'
  }
]
</script>

<style lang="scss" scoped></style>
