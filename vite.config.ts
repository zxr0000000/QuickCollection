import { defineConfig, loadEnv, type UserConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import compression from 'vite-plugin-compression';
import path from 'path';

const moduleInfo = require('./module.json');

const mutiEntry = (info: any) => {
  const inputModule = {};
  const moduleEntry = [];
  for (const key in info) {
    inputModule[key] = path.resolve(__dirname, info[key].html || info[key].entry);
    moduleEntry.push(info[key].entry);
  }
  return { inputModule, moduleEntry };
};

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const { inputModule } = mutiEntry(moduleInfo);

  return {
    plugins: [
      vue(),
      compression({
        threshold: 1024 * 500, // 1MB才会被压缩
        ext: '.gz',
        deleteOriginFile: false
      })
    ],
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '@bg': path.join(__dirname, './src/__background'),
        '@ct': path.join(__dirname, './src/__content'),
        '@pp': path.join(__dirname, './src/__popup')
      }
    },
    envPrefix: 'VITE_',
    build: {
      outDir: env.VITE_OUTDIR,
      rollupOptions: {
        input: inputModule,
        output: {
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: '[ext]/[name].[ext]',
          entryFileNames: '[name].js'
        }
      }
    }
  };
});
