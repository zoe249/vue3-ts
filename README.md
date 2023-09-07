# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## vscode插件安装
Vue Language Features(Volar)
TypeScript Vue Plugin(Volar)
Eslint
Prettier - Code formatter
禁用 Vetur
## 框架使用说明
1 proxy使用方法
import { useProxy } from '@/utils/proxy'
const { proxy } = useProxy()

2 接口调用:
src/api/index为接口的ts封装,使用时引入即可
src/api/commonApi为公共接口,挂到全局了(proxy)

3 全局挂载方法:
$api:公共接口
$message: 基于element的消息提示

4 Element为按需引入,组件自动引入,配置文件为components.d.ts(自动生成)

5 公共方法库
src/utils/index