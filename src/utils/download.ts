/**
 * @Description: 调用后端接口下载/导出excel
 * 注意请求时设置responseType: 'blob'
 */
const downLoadTemplate = (api: any, param?: any) => {
  let fileName = ''
  api()
    .then((res: any) => {
      if (!res) return
      // 提取文件名
      if (res.headers['content-disposition']) {
        fileName = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('filename=')[1])
      }
      // res.data 根据后端返回结构取值
      const blob = new Blob([res.data], { type: res.data.type || 'application/vnd.ms-excel;charset=utf-8' }) // 构造一个blob对象来处理数据，并设置文件类型
      const nav = window.navigator as any
      if (nav.msSaveOrOpenBlob) {
        //兼容IE10
        nav.msSaveBlob(blob, fileName)
      } else {
        const href = URL.createObjectURL(blob) //生成新的Blob URL表示指定的blob对象
        const a = document.createElement('a') //创建a标签
        a.style.display = 'none'
        a.href = href // 指定下载链接
        a.download = fileName //指定下载文件名
        a.click() //触发下载
        URL.revokeObjectURL(a.href) //释放URL对象
      }
    })
    .catch((err: any) => {
      console.log('err', err)
    })
}
export { downLoadTemplate }
