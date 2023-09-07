/**
 * @file 处理组合查询各页面的下拉选择项
 * @author lxn
 */
import api from '@/api/index'
import { organizationService } from '@/constants/apiConfig'
/**
 *
 * @param {*} prefix  查询下拉选项接口前缀， apiConfig文件的域名
 * @param {*} funcName 各页面组合查询对应的字段名
 * @returns
 */
const getCombineSearchOptions = (prefix: string, funcName: string) => {
  const url = `${organizationService}manTableItems`

  return new Promise((resolve, reject) => {
    let fieldOptions: any = []
    if (!fieldOptions || fieldOptions.length === 0) {
      const params = {
        tableEnum: funcName
      }
      api.get(url, params).then((res: any) => {
        fieldOptions = res.data
        // 特殊处理类型为日期的项， 用于页面视图搜索
        fieldOptions.forEach((item: any) => {
          if (item.type === 'date') {
            item.slotName = 'relatedSlot'
          }
        })
        resolve(fieldOptions)
      })
    } else {
      resolve(fieldOptions)
    }
  })
}

export { getCombineSearchOptions }
