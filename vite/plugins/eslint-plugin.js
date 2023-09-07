/**
 * @file eslint 规范插件
 */
import eslintPlugin from 'vite-plugin-eslint'

export default function createEslintPlugin() {
  return eslintPlugin({
    include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
  })
}
