import { loadEnv, type UserConfig } from 'vite'
import path from 'path'

/* 打包配置 */
const env = loadEnv(process.env.mode, process.cwd());

const content: UserConfig = {
  build: {
    outDir: env.VITE_CONTENT_OUTDIR,
    lib: {
      entry: [path.resolve(__dirname, 'src/__content/index.ts')],
      // 不支持ES6
      formats: ['cjs'],
      fileName: () => {
        return 'content.js'
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // 附属文件命名
          return 'content.css'
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': null,
  },
}

const background: UserConfig = {
  build: {
    // 输出目录
    outDir: env.VITE_BACKGROUND_OUTDIR,
    lib: {
      entry: [path.resolve(__dirname, 'src/__background/index.ts')],
      formats: ['cjs'],
      fileName: () => {
        return 'background.js'
      }
    },
  },
}

const option: UserConfig = {}

const sidepanel: UserConfig = {}

const defaultConfig = {}

const config = {
  content,
  background,
  option,
  sidepanel,
  defaultConfig,
}

export { content, background, option, sidepanel };
export default function getConfig(key: string) {
  if (config[key]) {
    return config[key];
  } else {
    return config.defaultConfig;
  }
}

