import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createElementPlusResolver from './components'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import createViteMockServe from './vite-mock'
import createEslintPlugin from './eslint-plugin'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Icons from 'unplugin-icons/vite'
export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createElementPlusResolver())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createViteMockServe())
  vitePlugins.push(createSvgIcon(isBuild))
  vitePlugins.push(createEslintPlugin())
  vitePlugins.push(DefineOptions())
  vitePlugins.push(
    Icons({
      autoInstall: true
    })
  )
  //vitePlugins.push(createVersionUpdate({version:__APP_VERSION__}))
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}
