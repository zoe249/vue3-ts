/**
 * @file 处理权限
 *
 * @param {*} val 权限名
 *  query: 查询 重置
    edit: 新增，编辑
    delete: 删除
    export： 导出
    import: 导入
    verify: 审核
    print: 打印
    dispatch：调度
 */

const permissionFilter = (val: string) => {
  // 通过路由path 获取权限的前缀
  const route = useRoute()
  const path = route.fullPath.substr(1)
  const reg = new RegExp('/', 'g')
  const tempAry = []
  let prefixPerm = path.replace(reg, ':')
  prefixPerm = prefixPerm + ':' + val
  tempAry.push(prefixPerm)

  return tempAry
}

export { permissionFilter }
