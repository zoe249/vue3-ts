<template>
  <el-button @click="handleLogin">登录</el-button>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import useMenuStore from '@/store/modules/menu'
import { getQuery } from '@/utils/index'
const userStore = useUserStore()
const menuStore = useMenuStore()
const router = useRouter()
const handleLogin = () => {
  let redirect = getQuery('redirect')
  userStore.login().then(() => {
    Promise.all([userStore.getInfoData(), menuStore.getRouterData()]).then(() => {
      router.push({ path: redirect || '/' })
    })
  })
}
</script>

<style lang="scss" scoped></style>
