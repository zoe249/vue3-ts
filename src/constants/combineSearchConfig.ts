/**
 * @file 公共配置
 */

//页码
const PAGE_CONFIG = {
  pageNum: 1,
  pageSize: 20,
  total: 0
}

// 比较值
// eq: 等于
// neq: 不等于
// lk: 包含
// nlk: 不包含
// gt: greater than 大于
// gte: greater than or equal 大于等于
// lt: less than 小于
// lte: less than or equal 小于等于
// lb：left brackets 左括号
// rb: right brackets 右括号

const CONPARE_LIST = [
  {
    label: '大于',
    value: 'gt'
  },
  {
    label: '大于等于',
    value: 'gte'
  },
  {
    label: '小于',
    value: 'lt'
  },
  {
    label: '小于等于',
    value: 'lte'
  },
  {
    label: '等于',
    value: 'eq'
  },
  {
    label: '不等于',
    value: 'neq'
  },
  {
    label: '包含',
    value: 'lk'
  },
  {
    label: '不包含',
    value: 'nlk'
  },
  {
    label: '在列表中',
    value: 'in'
  }
]

// 括号
const BRACKET_OPTIONS = [
  {
    label: '(',
    value: 'lb'
  },
  {
    label: ')',
    value: 'rb'
  }
]

// 连接配置
const LINK_OPTIONS = [
  {
    label: '且',
    value: 'and'
  },
  {
    label: '或',
    value: 'or'
  }
]

// 组合查询条件配置
const COMBINE_SEARCH_OPTIONS = [
  {
    prop: 'start',
    placeholder: '左括号',
    valueType: 'select',
    isValid: false,
    width: 110,
    options: BRACKET_OPTIONS,
    clearable: true
  },
  {
    prop: 'column',
    valueType: 'select',
    placeholder: '筛选条件',
    isValid: true,
    width: 186,
    clearable: true,
    options: [],
    rules: [{ required: true, message: '请选择筛选条件', trigger: 'blur' }]
  },
  {
    prop: 'type',
    valueType: 'select',
    placeholder: '等式',
    isValid: true,
    clearable: true,
    width: 146,
    options: CONPARE_LIST,
    rules: [{ required: true, message: '请选择等式', trigger: 'blur' }]
  },
  {
    prop: 'value',
    valueType: 'input',
    placeholder: '值',
    isValid: true,
    width: 146,
    clearable: true,
    rules: [{ required: true, message: '请输入值', trigger: 'blur' }]
  },
  {
    prop: 'end',
    placeholder: '右括号',
    valueType: 'select',
    isValid: false,
    width: 110,
    clearable: true,
    options: BRACKET_OPTIONS
  },
  {
    prop: 'ruleLink',
    valueType: 'select',
    placeholder: '连接符',
    isValid: false,
    width: 110,
    clearable: false,
    options: LINK_OPTIONS
  }
]

export { PAGE_CONFIG, COMBINE_SEARCH_OPTIONS }
