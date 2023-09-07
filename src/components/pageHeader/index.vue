<template>
  <div class="page-header">
    <div class="left">
      <div class="icon"></div>
      <div class="page-name">{{ route.meta.title }}</div>
    </div>
    <div class="right df aic">
      <!-- <div v-if="exportBtn" class="top-button-box-plain" @click="handleExport">
        <span class="iconfont icon-daochu"></span>
        <span class="add-btn">导出</span>
      </div> -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 12px;
  height: 48px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-name {
  font-size: 22px;
  font-weight: 500;
  color: #333333;
}

.right {
  padding-right: 15px;
  div:not(:last-child) {
    margin-right: 12px;
  }
}

.icon {
  background: $--color-primary;
  width: 4px;
  height: 26px;
  margin-left: 17px;
  margin-right: 12px;
  border-radius: 2px 2px 2px 2px;
}
.left {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
