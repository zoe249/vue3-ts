<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="tagsViewStore.cachedViews">
        <component :is="Component" v-if="!route.meta.link" :key="route.path" />
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
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
