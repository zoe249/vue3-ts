/**
 * v-hasPermi 操作权限处理
 * Copyright (c)
 */

import useUserStore from '@/store/modules/user'

export default {
  mounted(el: { parentNode: { removeChild: (arg0: any) => any } }, binding: { value: any }, _vnode: any) {
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = useUserStore().permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some((permission: string) => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('请设置操作权限标签值')
    }
  }
}
