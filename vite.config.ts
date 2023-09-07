import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // 忽略后缀
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // server: {
    //   host: true,
    //   open: true,
    //   https: false,
    //   proxy: {
    //     '/apiTest': {
    //       target: 'https://data.jsdelivr.com',
    //       changeOrigin: true
    //     }
    //   }
    // },
    build: {
      assetsDir: './static',
      chunkSizeWarningLimit: 500,
      minify: 'terser',
      cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
      terserOptions: {
        compress: {
          // warnings: false,
          drop_console: false, //打包时删除console
          drop_debugger: true, //打包时删除 debugger
          pure_funcs: ['console.log']
        },
        output: {
          // 去掉注释内容
          comments: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // 代码分包
            vue: ['vue', 'vue-router', 'pinia']
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 引入此scss文件 这样就可以在全局中使用预定义的变量了
          additionalData: '@import "./src/assets/styles/variables.module.scss";'
        }
      }
    }
  }
})
