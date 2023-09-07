<template>
  <Suspense timeout="0">
    <template #default>
      <router-view v-slot="{ Component }">
        <component :is="Component"></component>
      </router-view>
    </template>
  </Suspense>
</template>
<script lang="ts" setup></script>
<style lang="scss"></style>
