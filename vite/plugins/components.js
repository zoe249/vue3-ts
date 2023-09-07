/**
 * @file 按需导入 插件
 */
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
export default function createElementPlusResolver() {
  return Components({
    dts: './src/components.d.ts',
    dirs: ['src/components/'],
    extensions: ['vue'],
    include: [/\.vue$/, /\.vue\?vue/],
    resolvers: [
      ElementPlusResolver(),
      IconsResolver({
        enabledCollections: ['ep']
      })
    ]
  })
}
