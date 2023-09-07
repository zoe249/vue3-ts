<template>
  <div></div>
</template>

<script lang="ts">
import router from '@/router'
export default defineComponent({
  name: 'Refresh',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      router.replace(from.path)
    })
  },
  setup() {
    return {}
  }
})
</script>

<style scoped></style>
