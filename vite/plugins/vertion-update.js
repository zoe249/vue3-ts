import path from 'path'
import fs from 'fs'

const writeVersion = (versionFile, content) => {
  // 写入文件
  fs.writeFile(versionFile, content, (err) => {
    if (err) throw err
  })
}

export default function createVersionUpdate(options) {
  let config
  return {
    name: 'version-update',
    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig
    },
    buildStart() {
      // 生成版本信息文件路径 public\version.json
      const file = config.publicDir + path.sep + 'version.json'
      // 使用编译时间作为版本信息
      const content = JSON.stringify({ version: options.version })
      if (fs.existsSync(config.publicDir)) {
        writeVersion(file, content)
      } else {
        fs.mkdir(config.publicDir, (err) => {
          if (err) throw err
          writeVersion(file, content)
        })
      }
    }
  }
}
