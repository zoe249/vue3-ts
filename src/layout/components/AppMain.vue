<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="tagsViewStore.cachedViews">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import useTagsViewStore from '@/store/modules/tagsView'
const tagsViewStore = useTagsViewStore()
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100% - 40px);
  width: 100%;
  position: relative;
  overflow: auto;
  background-color: #f2f2f2;
  box-sizing: border-box;
  padding: 12px;
}
</style>
