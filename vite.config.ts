import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import autoImport from 'unplugin-vue-components/vite';
import compression from 'vite-plugin-compression';
import path from 'path';
// https://vitejs.dev/config/

import getExtensionConfig from './config'

export default defineConfig(({ mode, }) => {
  const extensionConfig = getExtensionConfig(mode);

  return {
    plugins: [
      vue(),
      Components({
        dts: path.resolve(__dirname, 'types/components.d.ts')
      }),
      autoImport({
        dts: path.resolve(__dirname, 'types/auto-import.d.ts')
      }),
      compression({
        threshold: 1024 * 500, // 500kb才会被压缩
        ext: '.gz',
        deleteOriginFile: false
      })
    ],
    server: {
      host: 'localhost',
      port: 3000,
      hmr: true,
      open: false,
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '@Project': path.join(__dirname, './src/Project')
      }
    },
    envPrefix: 'VITE_',
    ...extensionConfig
  }
});
