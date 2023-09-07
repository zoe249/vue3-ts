<template>
  <svg v-if="barCodeType === 'svg'" id="barcode"></svg>
  <!-- or -->
  <canvas v-else-if="barCodeType === 'canvas'" id="barcode"></canvas>
  <!-- or -->
  <img v-else-if="barCodeType === 'img'" id="barcode" />
</template>

<script setup lang="ts">
import barCode from 'jsbarcode'

const props = defineProps({
  // 生成二维码类型 svg canvas img
  barCodeType: {
    type: String,
    default: 'svg'
  },
  // 条形码宽度, 间隔宽度
  width: {
    type: Number,
    default: 1
  },
  // 条形码高度
  height: {
    type: Number,
    default: 50
  },
  // 条形码内容
  text: {
    type: String,
    required: true
  },
  /**
   * 参考文档 https://github.com/lindell/JsBarcode/wiki#barcodes
   * 生成的条形码格式, 建议 CODE128 格式
   */
  format: {
    type: String,
    default: 'CODE128'
  }
})
/**
 * 创建条形码
 */
const createBarCode = () => {
  barCode('#barcode', props.text, {
    width: props.width,
    height: props.height,
    format: props.format
  })
}
nextTick(() => createBarCode())
</script>

<style lang="scss" scoped></style>
