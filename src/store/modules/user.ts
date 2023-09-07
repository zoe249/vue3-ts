import { getToken, removeToken, setToken } from '@/utils/auth'
import { login } from '@/views/login/api'
import defAva from '@/assets/images/profile.jpg'
import cache from '@/plugins/cache'
const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: 'hxb',
    nickName: '优雅的小四',
    avatar: '',
    roles: [] as any,
    permissions: [] as any
  }),
  actions: {
    // 登录
    login(userInfo?: any) {
      return new Promise<void>((resolve, reject) => {
        login<{ token: string }>(userInfo)
          .then(({ code, data }) => {
            if (code == 200) {
              setToken(data.token)
              this.token = data.token
              resolve()
            }
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    },
    // 处理用户信息
    handleUserInfo(userInfo: any): any {
      const user = userInfo.user
      const avatar =
        user.avatar == '' || user.avatar == null ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar
      if (userInfo.roles && userInfo.roles.length > 0) {
        // 验证返回的roles是否是一个非空数组
        this.roles = userInfo.roles
        this.permissions = userInfo.permissions
      } else {
        this.roles = ['ROLE_DEFAULT']
      }
      this.name = user.userName
      this.nickName = user.nickName
      this.avatar = avatar
      return userInfo
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        const userInfo = cache.local.getJSON('userInfo')
        if (userInfo) {
          resolve(this.handleUserInfo(userInfo))
        } else {
          resolve(this.getInfoData())
        }
      })
    },
    // 通过接口获取用户信息
    getInfoData() {
      // TODO 向后端请求用户数据
      return new Promise((resolve) => {
        const info: any = {
          msg: '操作成功',
          code: 200,
          permissions: ['test:child_test:test1:query', 'test:child_test:test2:query'],
          roles: ['coder', 'op_soc_operation', '管理员'],
          user: {
            searchValue: null,
            createBy: 'admin',
            createTime: '2022-11-30 15:55:23',
            updateBy: null,
            updateTime: null,
            remark: null,
            params: {},
            userId: 32153,
            deptId: 100,
            userName: '77777777',
            nickName: '优雅的小四',
            email: '',
            phonenumber: '15727347817',
            sex: '0',
            avatar: '',
            postGroup: null,
            roleGroup: null,
            password: '$2a$10$4UZ0WetjpCOiRsQEt.eNGuFAtelS74oocF61M5FLZxv5qJ5hBiKm.',
            salt: null,
            status: '1',
            delFlag: '0',
            firstLogin: '1',
            loginIp: '',
            loginDate: null,
            dept: {
              searchValue: null,
              createBy: null,
              createTime: null,
              updateBy: null,
              updateTime: null,
              remark: null,
              params: {},
              deptId: 100,
              parentId: 0,
              ancestors: null,
              deptName: '家家悦集团',
              orderNum: '0',
              leader: '若依',
              phone: null,
              email: null,
              status: '0',
              delFlag: null,
              parentName: null,
              code: '1001',
              strictCode: null,
              drpCode: '0001',
              children: [],
              childrenIds: [
                5506, 5507, 5508, 5509, 5510, 5511, 5512, 5513, 5514, 5515, 5516, 5517, 5518, 5519, 5520,
                5521, 5522, 5523, 5524, 5525, 5526, 5527, 5528, 5529, 5530, 5531, 5532, 5533, 5534, 5535,
                5536, 5537, 5538, 5539, 5540, 5541, 5542, 5543, 5544, 5545, 5546, 5547, 5548, 5549, 5550,
                5551, 5552, 5553, 5554, 6369, 6370, 6371, 6373, 6374, 6375
              ]
            },
            roles: [
              {
                searchValue: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                params: {},
                roleId: 178,
                roleName: '运营',
                roleKey: 'op_soc_operation',
                roleSort: '0',
                dataScope: '2',
                menuCheckStrictly: false,
                deptCheckStrictly: false,
                status: '0',
                delFlag: null,
                flag: false,
                menuIds: null,
                deptIds: [100, 5526, 5558, 5568],
                systemId: 30,
                systemName: null,
                admin: false
              }
            ],
            roleIds: null,
            postIds: null,
            admin: false
          }
        }
        cache.local.setJSON('userInfo', info)
        resolve(this.handleUserInfo(info))
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve) => {
        this.token = ''
        this.roles = []
        this.permissions = []
        localStorage.clear()
        removeToken()
        resolve(true)
      })
    }
  }
})

export default useUserStore
