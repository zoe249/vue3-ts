<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="search-box">
    <!--加了个id,有用勿删-->
    <div id="defaultPopover">
      <div v-if="showPopover" class="view-box df jcsb aic">
        <div class="view-left">
          <MyPopover
            :title="viewObj.title"
            :select-arr="selectArr"
            :view-list="viewObj.viewList"
            @handle-leave="handleLeave"
            @change-view="changeView"
            @handle-edited="getPlans"
            @view-select-push="selectPush"
          ></MyPopover>
        </div>
        <div class="view-right df aic">
          <i class="iconfont icon-shaixuan" @click="openCombineSearch"></i>
          <div v-if="showBtn" class="show-hide-btn" @click="changeIsBrandFold()">
            {{ isBrandFold ? '收起' : '展开' }}
            <span style="display: inline-block" :class="[isBrandFold ? 'up-icon' : '']"
              ><i class="iconfont icon-jiantoudown"></i
            ></span>
          </div>
        </div>
      </div>
      <el-form ref="queryRef" class="query-form" :model="searchForm" inline>
        <div id="formItem" class="form-item">
          <el-form-item
            v-for="(item, index) in copyItem"
            :key="index"
            :label="item.label + '：'"
            :prop="item.prop"
          >
            <template v-if="item.isSlot">
              <slot :name="item.slotName"></slot>
            </template>
            <template v-else-if="item.type == 'dateRange2'">
              <div style="display: flex">
                <span>
                  <form-item
                    v-model:itemValue="mySearchForm[item.startProp]"
                    type="date"
                    :item-props="item"
                    @disableDateFunc="
                      (time: any, cb: any) => disableStartDateFunc(time, mySearchForm[item.endProp], cb)
                    "
                  ></form-item>
                </span>
                <span style="margin: 0px 8px">-</span>
                <span>
                  <form-item
                    v-model:itemValue="mySearchForm[item.endProp]"
                    type="date"
                    :item-props="item"
                    @disableDateFunc="
                      (time: Date, cb: any) => disableEndDateFunc(time, mySearchForm[item.startProp], cb)
                    "
                  ></form-item>
                </span>
              </div>
            </template>
            <template v-else>
              <form-item
                v-model:itemValue="mySearchForm[item.prop]"
                :type="item.type"
                :item-props="item"
              ></form-item>
            </template>
          </el-form-item>
          <div class="btn-box df aic">
            <div v-if="!showPopover && showBtn" class="show-hide-btn" @click="changeIsBrandFold()">
              {{ isBrandFold ? '收起' : '展开' }}
              <span style="display: inline-block" :class="[isBrandFold ? 'up-icon' : '']"
                ><i class="iconfont icon-jiantoudown"></i
              ></span>
            </div>
            <div class="handle-btns">
              <el-button v-hasPermi="permissionFilter('query')" class="reset-btn" plain @click="reset()">
                <i class="iconfont icon-fanhui1"></i>
                重置
              </el-button>
              <el-button
                v-hasPermi="permissionFilter('query')"
                type="primary"
                class="search-btn"
                @click="search()"
              >
                <i class="iconfont icon-fangdajing"></i>
                查询
              </el-button>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import FormItem from '@/components/FormItem/index.vue'
import MyPopover from '@/components/SearchTopForm/popover.vue'
import { deepObjClone, resetForm } from '@/utils/index'
import { permissionFilter } from '@/hooks/permissonFillter'
import { useProxy } from '@/utils/proxy'
import { PropType } from 'vue'
const props = defineProps({
  showPopover: {
    // 是否显示组合查询视图及方案
    type: Boolean,
    default: true
  },
  searchForm: {
    // 表单对象
    type: Object,
    required: true
  },
  searchItem: {
    // 表单项数组对象
    type: Array as PropType<TsearchItem[]>,
    default: () => []
  },
  initReset: {
    // 初始渲染是否重制一下表单
    type: Boolean,
    default: false
  }
})
const emits = defineEmits([
  'handleSearch',
  'handleReset',
  'openCombineSearch',
  'reCountTableHeight',
  'update:searchForm'
])
const clientWidth = document.body.clientWidth
const { proxy } = useProxy()
const mySearchForm = computed({
  // 表单对象,计算属性防止子改父
  get() {
    return props.searchForm
  },
  set(value) {
    emits('update:searchForm', value)
  }
})
const router = useRouter()
const path = router.currentRoute.value.path // 存路由地址,接口需要
const queryRef = ref()
const copyItem = ref<TsearchItem[]>([]) // 实际用来渲染的数据项
let selectArr = ref<TsearchItem[]>([])
// 所有下拉的数据集合,防止重复调用字典
let backupItem: TsearchItem[] = [] // 备份数据,用来处理展开回收
watch(
  () => props.searchItem, // 监听searchItem,页面初始化可能有异步
  (val) => {
    copyItem.value = deepObjClone(val).map((v: any) => {
      return v
    })
    backupItem = deepObjClone(copyItem.value)
    selectArr.value = val.filter((v) => v.type == 'select')
    if (clientWidth < 768) {
      nextTick(() => {
        hideItem()
        isBrandFold.value = false
      })
    }
  },
  { deep: true, immediate: true }
)

const isBrandFold = ref(true) // 控制展开收起
const showBtn = ref(false) // 是否显示展开收起按钮
/**
 * 切换展开收起
 */
function changeIsBrandFold() {
  if (isBrandFold.value) {
    hideItem()
  } else {
    copyItem.value = deepObjClone(backupItem)
    // 展开收起重新计算tableHeight表格高度
    nextTick(() => {
      emits('reCountTableHeight')
    })
  }
  isBrandFold.value = !isBrandFold.value
}
/**
 * 递归查元素高度,是否完成收起
 */
function hideItem() {
  const dom = document.getElementById('formItem') as HTMLElement
  if (dom.clientHeight > 60) {
    copyItem.value.pop()
    nextTick(() => {
      hideItem()
      // 展开收起重新计算tableHeight表格高度
      emits('reCountTableHeight')
    })
  }
}
// 视图对象
const viewObj = reactive({
  viewList: [
    { newName: '默认视图', planname: '默认视图', isDefault: true, defa: props.searchItem }
  ] as TviewList[],
  title: '默认视图'
})
// 视图方法
/**
 * 打开popover后的回调
 */
function handleLeave() {
  viewObj.viewList.map((v) => {
    v.newName = v.planname
    v.isEdit = false
  })
}
/**
 * 获取视图列表
 */
async function getPlans() {
  let { data } = await proxy.$api.queryPlan<any[]>({
    plantype: '01',
    permissionKey: path
  })
  let resList = data.map((item) => {
    item.isEdit = false
    item.newName = item.planname
    let defaArr = JSON.parse(item.defa)
    item.defa = defaArr.map((v: { itemCnname: any; itemName: string; type: string }) => {
      let obj: TsearchItem = {
        label: v.itemCnname,
        prop: v.itemName,
        type: v.type == 'date' ? 'dateRange2' : 'input'
      }
      if (v.type == 'date') {
        obj.startProp = 'begin' + v.itemName
        obj.endProp = 'end' + v.itemName
      }
      return obj
    })
    return item
  })
  viewObj.viewList = [
    ...[{ newName: '默认视图', planname: '默认视图', isDefault: true, defa: props.searchItem }],
    ...resList
  ]
}
/**
 * 切换视图
 * @param {Object} view 点击切换的视图对象
 */
function changeView(view: { planname: string; defa: any }) {
  viewObj.title = view.planname
  copyItem.value = deepObjClone(view.defa)
  backupItem = deepObjClone(copyItem.value)
  showBrandBtn()
}
/**
 * 字典下拉push回调
 * @param {Array} arr 需要保存的下拉数据
 */
function selectPush(arr: any) {
  selectArr.value.push(arr)
}
/**
 * 重制
 */
function reset() {
  resetForm('queryRef')
  emits('handleReset', '')
}
/**
 * 查询
 */
function search() {
  if (props.showPopover) {
    let str = ''
    backupItem.forEach((item) => {
      if (item.type === 'dateRange2') {
        if (mySearchForm.value[item.startProp]) {
          str = concatStr(str, 'gt', item, 'startProp')
        }
        if (mySearchForm.value[item.endProp]) {
          str = concatStr(str, 'lt', item, 'endProp')
        }
      } else {
        let val = mySearchForm.value[item.prop]
        if (Array.isArray(val) && !item.isIgnore) {
          if (val.length > 0) str = concatStr(str, 'in', item)
        } else if (!item.isIgnore) {
          if (val || val === false) str = concatStr(str, 'eq', item)
        }
      }
    })
    if (str) {
      str = str.substring(0, str.length - 1)
    }
    emits('handleSearch', str)
  } else {
    emits('handleSearch')
  }
}
/**
 * 处理拼接字符串
 * @param {string} str 需要处理的字符串
 * @param {string} type 类型字符,如eq
 * @param {Object} item 传入的表单相对象
 * @param {string} itemValue 传入的表单项属性名
 */
function concatStr(str: string, type: string, item: TsearchItem, itemValue = 'prop') {
  if (str) {
    str += 'and' + '_' + item.prop + '_' + type + '_' + mySearchForm.value[item[itemValue]] + '_'
  } else {
    str += item.prop + '_' + type + '_' + mySearchForm.value[item[itemValue]] + '_'
  }
  return str
}
/**
 * 设置是否显示展开收起按钮
 */
function showBrandBtn(isInit?: boolean) {
  nextTick(() => {
    const dom = document.getElementById('formItem') as HTMLElement
    if (dom.clientHeight > 60) {
      showBtn.value = true
      isBrandFold.value = true
      if (isInit && clientWidth < 768) {
        isBrandFold.value = false
      }
    } else {
      showBtn.value = false
    }
  })
}
/**
 *
 * @param {date} time 用户选择的结束时间
 * @param {date} val 用户选择的开始时间
 * @param {function} cb 给子组件的回调
 */
function disableEndDateFunc(time: Date, val: string, cb: (arg0: boolean) => void) {
  cb(time.getTime() < Date.parse(val || ''))
}
function disableStartDateFunc(time: Date, val: string, cb: (arg0: boolean) => void) {
  cb(time.getTime() > Date.parse(val || ''))
}
/**
 * 打开组合查询回调
 */
const openCombineSearch = () => {
  emits('openCombineSearch')
}
if (props.showPopover) {
  getPlans()
}
onMounted(() => {
  showBrandBtn(true)
  if (props.initReset) {
    reset()
  }
})
</script>
<style lang="scss" scoped>
.search-box {
  .view-box {
    margin-bottom: 12px;

    .view-left {
      display: flex;
    }

    .view-right {
      font-size: 14px;
      color: #558df7;
      cursor: pointer;
      margin-left: auto;
      .show-hide-btn {
        margin-left: 15px;
      }
    }
  }
  .query-form {
    width: 100%;
    display: flex;
    flex-grow: 1;
    .form-item {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
    }
    :deep(.el-form-item) {
      margin-bottom: 10px;
      margin-right: 20px;
      box-sizing: border-box;
    }
    :deep(.el-form-item__label) {
      padding: 0px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      white-space: nowrap;
    }
    .show-hide-btn {
      margin-right: 13px;
      margin-bottom: 10px;
    }
    .handle-btns {
      // min-width: 150px;
      display: flex;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 10px;

      .iconfont {
        margin-right: 6px;
        font-size: 14px;
      }

      .icon-fangdajing {
        font-size: 13px;
      }
    }
    .btn-box {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
  .show-hide-btn {
    font-size: 14px;
    color: #558df7;
    cursor: pointer;
    margin-left: auto;
    white-space: nowrap;
    .iconfont {
      font-size: 10px;
      margin-left: 2px;
    }

    .up-icon {
      transform: rotate(180deg);
    }
  }
}

// 移动端
@media only screen and (max-device-width: 768px) {
  .search-box {
    .query-form {
      :deep(.el-form-item) {
        margin-right: 0px;
      }

      flex-direction: column;
    }
  }
  .query-form {
    .btn-box {
      flex-direction: row-reverse;
      .show-hide-btn {
        margin-left: 13px;
        margin-right: 0px;
      }
    }
  }
}
</style>
