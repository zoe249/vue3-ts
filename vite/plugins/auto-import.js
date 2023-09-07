/**
 * @file 自动导入 插件
 */
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
export default function createAutoImport() {
  return AutoImport({
    imports: ['vue', 'pinia', 'vue-router'], //自动导入
    eslintrc: {
      enabled: true // 生成相应eslint json
    },
    resolvers: [
      ElementPlusResolver(),
      IconsResolver({
        prefix: 'Icon'
      })
    ],
    dts: './src/auto-imports.d.ts'
  })
}
