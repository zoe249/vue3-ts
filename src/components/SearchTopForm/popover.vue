<template>
  <el-popover
    v-model:visible="showPopover"
    :width="340"
    :hide-after="0"
    placement="bottom-start"
    trigger="click"
    popper-class="search-popover"
    :teleported="false"
    @after-leave="handleLeave()"
  >
    <template #reference>
      <div ref="viewRef" class="view-btn">
        <span>{{ title }}</span>
        <i class="iconfont icon-jiantoudown"></i>
      </div>
    </template>

    <div
      v-for="(item, index) in viewList"
      :key="index"
      class="content-box"
      :style="{ 'background-color': indexBg == index ? '#edf3ff' : 'transparent' }"
      @click="indexBg = index"
    >
      <div>
        <el-input
          v-if="item.isEdit"
          v-model="item.newName"
          class="item-input"
          placeholder="请输入名称,最多10个字"
        ></el-input>
        <div v-else class="item-input curp" @click="changeView(item)">{{ item.newName }}</div>
      </div>
      <div class="df aic jcsb">
        <template v-if="item.isEdit">
          <el-button class="primaryColor" link @click="sure(item)">确定</el-button>
          <el-button class="primaryColor" link @click="cancel(item)">取消</el-button>
        </template>
        <template v-else-if="!item.isEdit && !item.isDefault">
          <el-button class="primaryColor" link @click="edit(item)">
            <i class="iconfont icon-bianji4"></i>
            编辑</el-button
          >
          <el-button class="dangerColor" link @click="delItem(item)">
            <i class="iconfont icon-shanchu"></i>
            删除</el-button
          >
        </template>
      </div>
    </div>
  </el-popover>
</template>
<script setup lang="ts">
import { useProxy } from '@/utils/proxy'
import { PropType } from 'vue'
const props = defineProps({
  viewList: {
    // 视图列表数据
    type: [Array, Object] as PropType<TviewList[]>,
    default: () => []
  },
  title: {
    // 标题
    type: String,
    default: '默认视图'
  },
  isCombineSearch: {
    //是否是组合查询渲染使用
    type: Boolean,
    default: false
  },
  selectArr: {
    // 所有需要拉下的数据集合
    type: Array as PropType<TsearchItem[]>,
    default: () => []
  }
})
const emit = defineEmits(['changeView', 'handleLeave', 'handleEdited', 'viewSelectPush'])
const { proxy } = useProxy()
const showPopover = ref(false) // 显示隐藏开关
const indexBg: any = ref() // 控制点击渲染背景颜色
/**
 * 打开编辑
 * @param {object} item 视图数据项
 */
function edit(item: TviewList) {
  item.isEdit = true
}
/**
 * 编辑视图
 * @param {object} item 视图数据项
 */
async function sure(item: TviewList) {
  if (!item.newName) {
    proxy.$message.msgError('名称不能为空')
    return
  }
  if (item.newName.length > 10) {
    proxy.$message.msgError('名称不能超过10位')
    return
  }
  //TODO await editQueryPlan(item.id, { planname: item.newName })
  proxy.$message.msgSuccess('修改成功')
  emit('handleEdited')
}
function cancel(item: TviewList) {
  item.newName = item.planname
  item.isEdit = false
}
/**
 * 切换视图
 * @param {object} view 点击的视图数据项
 */
async function changeView(view: TviewList) {
  if (!view.isDefault && !props.isCombineSearch) {
    let promiseBox: any[] = []
    view.defa.forEach((item: { type: string; prop: string | number; selectOptions: any }) => {
      if (item.type == 'select') return
      let selectIndexOf = props.selectArr.findIndex((v) => v.prop == item.prop)
      if (selectIndexOf != -1) {
        item.type = 'select'
        item.selectOptions = props.selectArr[selectIndexOf].selectOptions
        return
      }
      // TODO  if (DicsObj[item.prop]) {
      //     item.type = 'select'
      //     promiseBox.push(getDicList(DicsObj[item.prop], item))
      //   }
    })
    Promise.all(promiseBox).then(() => {
      handleViewChange(view)
    })
  } else {
    handleViewChange(view)
  }
}
/**
 * 切换视图的回调
 * @param {object} view 视图数据项
 */
function handleViewChange(view: any) {
  emit('changeView', view)
  showPopover.value = false
}
/**
 * 根据code获取字典下拉值
 * @param {string} ddcode 字典code
 * @param {object} item 需要获取下拉值的视图项
 */
// function getDicList(ddcode: string, item: { selectOptions: TselectOptions }) {
//   return new Promise((resolve) => {
//     getListByCode({ ddcode }).then((res: { data: any[] }) => {
//       if (res.data && res.data.length > 0) {
//         item.selectOptions = res.data.filter((v: { status: boolean }) => v.status)
//       } else {
//         item.selectOptions = []
//       }
//       emit('viewSelectPush', item)
//       resolve()
//     })
//   })
// }
/**
 * 打开popover前的回调
 */
function handleLeave() {
  emit('handleLeave')
}
/**
 * 删除视图
 * @param {object} item 需要删除的视图数据项
 */
function delItem(item: TviewList) {
  proxy.$message.confirm('是否要删除该视图?').then(async () => {
    //TODO await deleteQueryPlan(item.id)
    proxy.$message.msgSuccess('删除成功')
    emit('handleEdited')
  })
}
</script>

<style lang="scss" scoped>
.view-btn {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  margin-right: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;

  .iconfont {
    font-size: 13px;
    color: #999999;
    margin-left: 4px;
  }
}

.content-box {
  box-sizing: border-box;
  padding: 0px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background-color: #edf3ff !important;
  }

  .item-input {
    height: 32px;
    line-height: 32px;
  }

  .iconfont {
    font-size: 14px;
    margin-right: 5px;
  }
}

.curp {
  cursor: pointer;
}

.child-box {
  box-sizing: border-box;
  padding: 0px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  :deep(.el-input) {
    width: 180px;
  }
}

.primaryColor {
  color: $blue !important;
}

.dangerColor {
  color: $del !important;
}
</style>
<style>
.search-popover {
  padding: 8px 0px !important;
}
</style>
