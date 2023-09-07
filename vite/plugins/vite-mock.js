/**
 * @file mock 插件
 */
import { viteMockServe } from 'vite-plugin-mock'

export default function createViteMockServe() {
  return viteMockServe({
    mockPath: './mock',
    watchFiles: true,
    prodEnabled: false
  })
}
