import { MockMethod } from 'vite-plugin-mock'
const tableData = [
  {
    id: 10001,
    receiptsId: '500IFJSIJFJAIS',
    contractId: '500IFJSIJFJAIS',
    supplierName: '企业A',
    createDate: '2020-05-03 08:10:42',
    receiptsState: 1,
    contractState: 1,
    company: '企业B'
  },
  {
    id: 10002,
    receiptsId: '300IFJSIJFJAIS',
    contractId: '300IFJSIJFJAIS',
    supplierName: '企业B',
    createDate: '2020-05-03 08:10:42',
    receiptsState: 1,
    contractState: 1,
    company: '企业C'
  },
  {
    id: 10003,
    receiptsId: '700IFJSIJFJAIS',
    contractId: '700IFJSIJFJAIS',
    supplierName: '企业C',
    createDate: '2020-05-03 08:10:42',
    receiptsState: 2,
    contractState: 2,
    company: '企业A'
  },
  {
    id: 10004,
    receiptsId: '900IFJSIJFJAIS',
    contractId: '900IFJSIJFJAIS',
    supplierName: '企业D',
    createDate: '2020-05-03 08:10:42',
    receiptsState: 3,
    contractState: 1,
    company: '企业C'
  }
]
const queryList = [
  {
    id: '5428436661620179337',
    planno: '42001659-08b8-4c9e-bfce-a30892cf8921',
    planname: 'neww88',
    plantype: '01',
    permissionKey: '/receive/buy_receive/buy_order',
    permissionname: ' 直送订单',
    defa: '[{"isCombination":false,"tableEnum":"BUY_ORDER","itemName":"supid","itemCnname":"供应商","type":"string","dataSourcesService":null,"dataSourcesUri":null},{"isCombination":false,"tableEnum":"BUY_ORDER","itemName":"timeSend","itemCnname":"要求送达日期","type":"date","dataSourcesService":null,"dataSourcesUri":null}]',
    createTime: '2023-02-16 10:53:39',
    createBy: '77777777'
  },
  {
    id: '5428451790541816197',
    planno: '40bd7b9c-3406-442b-acbe-94cbdc9d0767',
    planname: '98',
    plantype: '01',
    permissionKey: '/receive/buy_receive/buy_order',
    permissionname: ' 直送订单',
    defa: '[{"isCombination":false,"tableEnum":"BUY_ORDER","itemName":"bill","itemCnname":"单据号","type":"string","dataSourcesService":null,"dataSourcesUri":null},{"isCombination":false,"tableEnum":"BUY_ORDER","itemName":"remark","itemCnname":"备注","type":"string","dataSourcesService":null,"dataSourcesUri":null}]',
    createTime: '2023-02-16 11:01:10',
    createBy: '77777777'
  }
]

export default [
  {
    url: '/mock/api/getList',
    method: 'post',
    response: () => {
      return { code: 200, message: '请求成功', data: { list: tableData, total: 4 } }
    }
  },
  {
    url: '/mock/api/addForm',
    method: 'post',
    response: () => {
      return { code: 200, message: '请求成功' }
    }
  },
  {
    url: '/mock/api/login',
    method: 'get',
    response: () => {
      return { code: 200, message: '请求成功', data: { token: '1232132344' } }
    }
  },
  {
    url: '/mock/api/queryPlan',
    method: 'get',
    response: () => {
      return { code: 200, message: '请求成功', data: queryList }
    }
  }
] as MockMethod[]
