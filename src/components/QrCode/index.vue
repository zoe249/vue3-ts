<template>
  <canvas id="canvas" width="300" height="300"></canvas>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import QRCode from 'qrcode'

type color = {
  dark: string
  light: string
}

interface optionsType {
  width?: number
  margin?: number
  color?: color
  [key: string]: any
}
const emits = defineEmits(['success', 'error'])
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  options: {
    type: Object as PropType<optionsType>,
    default: () => ({})
  }
})
nextTick(() => {
  var canvas = document.getElementById('canvas')

  QRCode.toCanvas(canvas, props.text, props.options, function (error: any) {
    // 二维码生成失败
    if (error) emits('error')
    // 二维码生成成功
    emits('success')
  })
})
</script>

<style lang="scss" scoped></style>
