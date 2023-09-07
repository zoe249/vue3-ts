<template>
  <el-button @click="handleClick">模拟请求接口</el-button>
  <form-item v-model:item-value="value" type="select" :item-props="props"></form-item>
</template>

<script lang="ts" setup>
import { useProxy } from '@/utils/proxy'
import { debounce } from '@/utils/index'
const { proxy } = useProxy()
const props = ref({
  prop: 'deviceType',
  label: '设备类型',
  type: 'select',
  clearable: true,
  selectOptions: [{ name: 'aaa', code: '111' }]
})
const value = ref(null)
const handleClick = debounce(async () => {
  let { code, message, data } = await proxy.$api.getList<{ list: any }>()
  console.log(data)
  proxy.$message.alert('获取成功')
}, 1000)
</script>

<style lang="scss" scoped></style>
