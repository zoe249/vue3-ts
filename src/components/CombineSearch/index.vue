<template>
  <el-drawer
    :model-value="drawerVisible"
    direction="rtl"
    size="920"
    :close-on-click-modal="false"
    :with-header="false"
    :before-close="handleClose"
    custom-class="combine-search"
  >
    <div>
      <div class="combine-search-top c-flex c-items-center c-justify-between">
        <div class="c-flex c-items-center">
          <span class="left-icon"></span>
          <span class="left-title">{{ title || '高级组合查询' }}</span>
        </div>
        <i class="iconfont icon-icon_guanbi" @click="handleClose"></i>
      </div>
      <div class="combine-search-content">
        <div class="c-flex c-items-center c-justify-between mb20">
          <span class="content-title">查询条件</span>
          <div class="c-flex c-items-center">
            <my-popover
              v-if="planState.planOptions.length > 0"
              :view-list="planState.planOptions"
              :title="planState.currViewTitle"
              :is-combine-search="true"
              @change-view="changeView"
              @handle-edited="getPlans"
            ></my-popover>
            <el-button type="primary" class="add-btn-short ml10" @click="addColumns">添加条件</el-button>
          </div>
        </div>
        <el-table :data="formData" style="width: 100%">
          <template v-for="(item, index) in COMBINE_SEARCH_OPTIONS" :key="index">
            <el-table-column :prop="item.prop" :width="item.width" :min-width="item.width">
              <template #default="{ row, $index }">
                <!-- 筛选条件下拉选择 -->
                <el-form
                  v-if="item.prop === 'column'"
                  :ref="`formRef${$index}${item.prop}`"
                  :model="row"
                  :validate-on-rule-change="true"
                >
                  <el-form-item :prop="item.prop" :rules="item.rules">
                    <el-select
                      v-model="row[item.prop]"
                      :clearable="item.clearable"
                      :placeholder="item.placeholder || `请选择`"
                      value-key="itemName"
                    >
                      <el-option
                        v-for="ele in planState.primaryOptions"
                        :key="ele.itemName"
                        :label="ele.itemCnname"
                        :value="ele"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>

                <template v-else-if="item.prop === 'value'">
                  <el-form
                    v-if="row.column && row.column['type'] === 'DATE'"
                    :ref="`formRef${$index}${item.prop}`"
                    :model="row"
                    :validate-on-rule-change="true"
                  >
                    <el-form-item
                      :prop="item.prop"
                      :rules="[{ required: true, message: '请选择日期', trigger: 'blur' }]"
                    >
                      <el-date-picker
                        v-model="row[item.prop]"
                        type="date"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择时间"
                      />
                    </el-form-item>
                  </el-form>
                  <el-form
                    v-else
                    :ref="`formRef${$index}${item.prop}`"
                    :model="row"
                    :validate-on-rule-change="true"
                  >
                    <el-form-item :prop="item.prop" :rules="item.rules">
                      <el-input v-model="row[item.prop]" placeholder="值"></el-input>
                    </el-form-item>
                  </el-form>
                </template>
                <template v-else>
                  <el-form
                    v-if="item.isValid === true"
                    :ref="`formRef${$index}${item.prop}`"
                    :model="row"
                    :validate-on-rule-change="true"
                  >
                    <el-form-item :prop="item.prop" :rules="item.rules">
                      <el-select
                        v-model="row[item.prop]"
                        :clearable="item.clearable"
                        :placeholder="item.placeholder || `请选择`"
                      >
                        <el-option
                          v-for="ele in item.options"
                          :key="ele.value"
                          :label="ele.label"
                          :value="ele.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <el-select
                    v-else
                    v-model="row[item.prop]"
                    :clearable="item.clearable"
                    :placeholder="item.placeholder || `请选择`"
                    style="margin-bottom: 16px"
                  >
                    <el-option
                      v-for="ele in item.options"
                      :key="ele.value"
                      :label="ele.label"
                      :value="ele.value"
                    />
                  </el-select>
                </template>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-slot="{ $index }" width="60">
            <section style="margin-bottom: 16px">
              <i
                v-if="$index !== 0"
                class="iconfont icon-shanchu"
                style="color: #fc807b"
                @click="deleteColumns($index)"
              ></i>
            </section>
          </el-table-column>
        </el-table>
      </div>
      <div class="combine-search-footer c-flex c-items-center c-justify-between mt20">
        <div class="footer-left c-flex c-items-center">
          <self-popover
            title="添加为视图"
            label="添加视图名称"
            :disabled="planState.columns.length === 0"
            class="mr15"
            @save="saveView"
          ></self-popover>
          <self-popover
            title="保存查询方案"
            label="添加查询方案名称"
            :disabled="planState.columns.length === 0"
            @save="saveModal"
          ></self-popover>
        </div>
        <div class="footer-right">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="confirmSearchHandle">确定</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script setup name="combineSearch" lang="ts">
import { ComponentInternalInstance } from 'vue'
import cache from '@/plugins/cache'
import $bus from '@/utils/eventBus.js'
import { deepObjClone } from '@/utils/index'
import { COMBINE_SEARCH_OPTIONS } from '@/constants/combineSearchConfig'
import { queryPlan, queryViewById, addQueryPlan } from '@/api/combineSearch'
import { getCombineSearchOptions } from '@/hooks/combineSearch'
import selfPopover from './self-popover.vue'
import MyPopover from '../SearchTopForm/popover.vue'

import { useProxy } from '@/utils/proxy'
const { proxy } = useProxy()
const context = getCurrentInstance() as ComponentInternalInstance

const props = defineProps({
  // 是否显示组合查询视图
  drawerVisible: {
    type: Boolean,
    default: false
  },
  // 查询标题
  title: {
    type: String,
    default: ''
  },
  // 接口前缀key值， 对应地址在/utils/apiConfig文件
  prefixName: {
    type: String,
    default: ''
  },
  // 对应页面查询下拉选项参数
  funcName: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['goCombineSearch', 'closeCombineSearch'])
const route = useRoute()
const router = useRouter()
const path = router.currentRoute.value.path // 存路由地址,接口需要
const meta = router.currentRoute.value.meta

// 获取查询方案
const planState = reactive({
  // 选中的查询方案
  selectPianno: '',
  // 查询方案options
  planOptions: [],
  // 当前查询方案
  currPlan: null,
  route: null,
  primaryOptions: [] as any,
  // 查询视图下拉popover展示名称
  currViewTitle: '选择查询方案',
  // 添加的查询条件， 用于保存判断
  columns: []
})

// 获取下拉搜索条件
const getSearchOptions = async () => {
  await getCombineSearchOptions(props.prefixName, props.funcName).then((res: any) => {
    if (res.length > 0) {
      planState.primaryOptions = res
    }
  })
}

const formData = ref<any>([])
// 获取查询方案， type类型写死
const getPlans = () => {
  queryPlan({
    plantype: '02',
    permissionKey: path
  }).then(({ data }: any) => {
    let resList = data.map((item: any) => {
      item.isEdit = false
      item.newName = item.planname
      // 下面两个参数写死
      item.type = 'input'
      item.isDefault = false
      return item
    })
    planState.planOptions = resList
  })
}

// 根据选中的方案名称查询相应在的方案
const selectPlanHandle = (val: string) => {
  queryViewById({
    planno: val
  }).then(({ data }: any) => {
    formData.value = JSON.parse(data)
  })
}

// 初始化各列的下拉项
let obj: any = {}
const data = [{}]
for (let item of COMBINE_SEARCH_OPTIONS) {
  data.forEach(() => {
    if (!obj[item.prop]) {
      obj[item.prop] = null
    }
  })
}

// 添加查询条件
const addColumns = () => {
  let id = `CSId-${~~(Math.random() * 1000000).toFixed(0)}`
  let obj1 = Object.assign({}, obj, {
    id
  })
  formData.value.push(obj1)
}
addColumns()

// 删除查询条件
const deleteColumns = (index: number) => {
  formData.value.splice(index, 1)
}

// 所有表单校验
const validateTableForms = () => {
  const { refs }: any = context
  const resultArr = [] //用来接受返回结果的数组
  for (let key in refs) {
    if (key.substring(0, 7) == 'formRef' && Number(key.substr(7, 1)) > -1) {
      const formEl = refs[key][0]
      const task = new Promise((resolve, reject) => {
        formEl.validate((valid: boolean, fields: any) => {
          if (valid) {
            resolve(valid)
          } else {
            reject(fields)
          }
        })
      })
      resultArr.push(task)
    }
  }
  return resultArr
}

const confirmSearch = () => {
  let arr = deepObjClone(formData.value)
  let str = ''
  // 组合查询结果
  // eg: #name=1 and (age < 18 or age > 20)
  // name_eq_1_and_lb_age_lt_18_or_age_gt_20_rb
  arr.forEach((ele: any) => {
    str +=
      `${ele.start ? ele.start + '_' : ''}` +
      `${ele.column ? ele.column.itemName + '_' : ''}` +
      `${ele.type ? ele.type + '_' : ''}` +
      `${ele.value ? ele.value + '_' : ''}` +
      `${ele.end ? ele.end + '_' : ''}` +
      `${ele.ruleLink ? ele.ruleLink + '_' : 'and_'}`
  })

  const lastIndex = str.lastIndexOf('_')
  const secondLastIndex = str.lastIndexOf('_', lastIndex - 1)
  str = str.substr(0, secondLastIndex)

  emit('goCombineSearch', str)
  handleClose()
}

// 获取查询数据信息, 进行查询
const confirmSearchHandle = () => {
  Promise.all([...validateTableForms()])
    .then(() => {
      confirmSearch()
    })
    .catch((err) => {
      console.error(err)
    })
}

// 保存为视图，只保存条件， 不保存值
const saveView = (e: string) => {
  let arr = deepObjClone(formData.value)
  let tempAry: any[] = []
  arr.forEach((ele: any) => {
    for (let item in ele) {
      if (item === 'column') {
        tempAry.push(ele[item])
      }
    }
  })

  const params = {
    // 方案名称
    planname: e,
    // 方案类型 params:01查询视图， 02 查询方案
    plantype: '01',
    // 菜单
    permissionKey: path,
    // 菜单名称
    permissionname: meta.title,
    // 参数说明	 查询条件字符串
    defa: JSON.stringify(tempAry)
  }

  addQueryPlan(params).then((res: any) => {
    proxy.$message.msgSuccess('保存视图成功')
    // 添加视图成功后， 通过全局事件通知到搜索组件， 页面搜索组件重新获取下拉视图列表
    $bus.emit('saveModel', path)
  })
}

// 保存查询方案: 把所有条件和条件值都保存
const saveModal = (e: any) => {
  let arr = deepObjClone(formData.value)
  arr = JSON.stringify(arr)
  const params = {
    // 方案名称
    planname: e,
    // 方案类型 params: 	01查询视图， 02 查询方案
    plantype: '02',
    // 菜单
    permissionKey: path,
    // 菜单名称
    permissionname: meta.title,
    // 参数说明	 查询条件字符串
    defa: arr
  }
  addQueryPlan(params).then((res: any) => {
    proxy.$message.msgSuccess('保存查询方案成功')
    getPlans()
  })
}
// 重置， 条件数量不变， 值清空
const reset = () => {
  formData.value.forEach((item: any) => {
    for (let e in item) {
      item[e] = null
    }
  })
}

const handleClose = () => {
  emit('closeCombineSearch')
}

// 处理查询视图
const changeView = (val: any) => {
  formData.value = JSON.parse(val.defa)
  planState.currViewTitle = val.newName
}

watch(
  route,
  () => {
    getPlans()
    getSearchOptions()
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => formData.value,
  (val) => {
    planState.columns = val.filter((item: any) => {
      return item.column
    })
  },
  {
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.combine-search {
  padding: 23px 40px;
  .el-drawer__body {
    padding: 0;
  }
  .icon-icon_guanbi {
    cursor: pointer;
    &:hover {
      color: $blue;
    }
  }

  &-top {
    margin-bottom: 36px;
    font-size: 26px;

    .left-icon {
      display: inline-block;
      background: $blue;
      width: 4px;
      height: 26px;
      margin-right: 12px;
      border-radius: 2px;
    }
  }

  &-content {
    .content-title {
      font-size: 18px;
      font-weight: 500;
    }
  }
}

:deep(.el-table) {
  border-bottom: none !important;
  --el-table-border-color: #fff;
  .el-table__cell {
    padding: 16px 0 0 0;
  }
  .el-table__body tr:hover > td.el-table__cell {
    background-color: #edf3ff;
  }
  .el-table__inner-wrapper {
    &::before {
    }
  }
}

:deep(.el-drawer__title) {
  color: #333 !important;
  font-size: 26px !important;
}

:deep(.el-table__header-wrapper) {
  display: none !important;
}

:deep(.el-table__inner-wrapper::before) {
  left: 0;
  bottom: 0;
  width: 0 !important;
  height: 0 !important;
}
// 移动端
@media only screen and (max-device-width: 768px) {
  .combine-search-footer {
    flex-direction: column;
    .footer-left {
      margin-bottom: 10px;
    }
  }
}
</style>
