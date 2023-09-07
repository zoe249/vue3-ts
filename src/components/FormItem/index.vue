<template>
  <el-select
    v-if="type == 'select'"
    v-model="value"
    :multiple="itemProps.multiple || false"
    :collapse-tags="itemProps.multiple || false"
    :teleported="itemProps.teleported === false ? false : true"
    collapse-tags-tooltip
    :filterable="itemProps.filterable"
    :disabled="itemProps.disabled"
    :remote="itemProps.remote"
    :remote-method="itemProps.remoteMethod"
    :style="{ width: itemProps.itemWidth ? itemProps.itemWidth + 'px' : defaultWidth }"
    clearable
    :placeholder="itemProps?.placeholder || '请选择'"
    @change="itemProps.handleSelect"
  >
    <el-option
      v-for="(item, index) in itemProps?.selectOptions"
      :key="index"
      :value="item.code"
      :label="itemProps.onlyName ? item.name : item.code + '-' + item.name"
    />
  </el-select>
  <el-date-picker
    v-else-if="type == 'date'"
    v-model="value"
    :style="{ width: itemProps.itemWidth ? itemProps.itemWidth + 'px' : defaultWidth }"
    type="datetime"
    :disabled="itemProps.disabled"
    clearable
    :value-format="'YYYY-MM-DD HH:mm:ss' || itemProps.dateFormat"
    :placeholder="itemProps?.placeholder || '请选择'"
  >
  </el-date-picker>
  <el-date-picker
    v-else-if="type == 'dateRange'"
    v-model="value"
    :style="{ width: itemProps.itemWidth ? itemProps.itemWidth + 'px' : '280px' }"
    clearable
    :disabled="itemProps.disabled"
    :value-format="'YYYY-MM-DD HH:mm:ss' || itemProps.dateFormat"
    type="daterange"
    range-separator="-"
    :start-placeholder="itemProps?.placeholder || '请选择开始时间'"
    :end-placeholder="itemProps?.placeholder || '请选择结束时间'"
  ></el-date-picker>
  <el-checkbox-group v-else-if="type == 'checkbox'" v-model="value" :disabled="itemProps.disabled">
    <el-checkbox v-for="(item, index) in itemProps.checkboxOptions" :key="index" :label="item.code">
      {{ item.name }}
    </el-checkbox>
  </el-checkbox-group>
  <el-checkbox
    v-else-if="type == 'check'"
    v-model="value"
    :style="{ width: itemProps.itemWidth ? itemProps.itemWidth + 'px' : defaultWidth }"
    :true-label="itemProps.trueLabel"
    :false-label="itemProps.falseLabel"
    :disabled="itemProps.disabled"
  >
    {{ itemProps.checkLabel }}
  </el-checkbox>
  <el-radio-group v-else-if="type == 'radio'" v-model="value" :disabled="itemProps.disabled">
    <el-radio v-for="(item, index) in itemProps.radioOptions" :key="index" :label="item.code">{{
      item.name
    }}</el-radio>
  </el-radio-group>
  <el-switch
    v-else-if="type == 'switch'"
    v-model="value"
    :disabled="itemProps.disabled"
    inline-prompt
    :active-text="itemProps.switchActiveText"
    :inactive-text="itemProps.switchOffText"
  />
  <slot v-else-if="type == 'slot'"></slot>
  <el-input
    v-else
    v-model="value"
    :style="{ width: itemProps.itemWidth ? itemProps.itemWidth + 'px' : defaultWidth }"
    :disabled="itemProps.disabled"
    clearable
    :placeholder="itemProps?.placeholder || '请输入'"
  >
  </el-input>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
type TselectOptions = {
  name: string
  code: string | number
  [key: string]: unknown
}

type TItemProps = {
  placeholder?: string
  selectOptions?: Array<TselectOptions>
  checkboxOptions?: Array<TselectOptions>
  radioOptions?: Array<TselectOptions>
  label?: string
  disabled?: boolean
  itemWidth?: string
  [key: string]: any
}
const props = defineProps({
  // v-model绑定字段
  itemValue: {
    type: [String, Number, null] as PropType<any>,
    required: true
  },
  // 渲染类型
  type: {
    type: String,
    default: 'input'
  },
  // 渲染项
  itemProps: {
    type: Object as PropType<TItemProps>,
    required: true
  }
})
const emits = defineEmits(['update:itemValue'])
const defaultWidth = '130px'
const value = computed({
  get() {
    return props.itemValue
  },
  set(value) {
    emits('update:itemValue', value)
  }
})
</script>
<style lang="scss" scoped>
.el-checkbox-group,
.el-radio-group {
  display: flex;
}
</style>
<style>
.el-scrollbar .el-select-dropdown__item.hover {
  background-color: #edf3ff !important;
}
.el-select__tags {
  max-width: 400px !important;
}
</style>
