<template>
  <div>
    <search-top-form
      class="search-form"
      :search-form="searchObj.searchForm"
      :search-item="searchObj.searchItem"
      @handle-search="handleSearch"
      @handle-reset="handleReset"
    ></search-top-form>
    <i-ep-plus></i-ep-plus>
  </div>
</template>

<script setup lang="ts" name="Test2">
const searchObj = reactive({
  searchForm: { descr: null },
  searchItem: [
    {
      prop: 'descr',
      label: '参数描述',
      clearable: true
    }
  ]
})
const handleSearch = (res: string) => {
  console.log(res)
}
const handleReset = () => {
  handleSearch('')
}
</script>

<style lang="scss" scoped></style>
