<template>
  <div class="pager-wrap">
    <el-pagination
      v-model:current-page="state.currentPage"
      v-model:page-size="state.pageSize"
      :pager-count="pagerCount"
      :page-sizes="pageSizes"
      :small="small"
      :background="background"
      :layout="layout"
      :hide-on-single-page="hideOnSinglePage"
      :disabled="disabledPage"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts" name="pagination">
interface Propstype {
  small?: boolean // 是否使用小型分页
  pagerCount?: number // 移动端页码按钮的数量端默认值5
  background?: boolean // 是否为分页按钮添加背景色
  layout?: string // 布局
  hideOnSinglePage?: boolean // 只有一页时是否隐藏
  disabledPage?: false // 是否禁用分页
  total: number // 总条数
  pageSizes?: number[] // 每页显示个数选择器的选项设置
}
// props默认值
const props = withDefaults(defineProps<Propstype>(), {
  small: false,
  pagerCount: document.body.clientWidth < 992 ? 5 : 7,
  background: false,
  layout: 'prev, pager, next, total, sizes, jumper',
  hideOnSinglePage: false,
  disabledPage: false,
  total: 0,
  pageSizes: () => [10, 20, 40, 60, 80, 100]
})
const emits = defineEmits(['handleCurrentChange', 'handleSizeChange'])
const state = reactive({
  currentPage: 1, // 当前页
  pageSize: 20 // 每页条数
})
const handleSizeChange = (val: number) => {
  state.pageSize = val
  emits('handleSizeChange', state)
}
const handleCurrentChange = (val: number) => {
  state.currentPage = val
  emits('handleCurrentChange', state)
}
</script>

<style scoped>
.pager-wrap {
  background-color: #ffffff;
  padding: 15px;
}
</style>
