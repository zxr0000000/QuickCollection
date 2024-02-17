import { defineConfig, loadEnv, type UserConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import compression from 'vite-plugin-compression';
import UnoCSS from 'unocss/vite'
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';

const moduleInfo = require('./module.json');
const SOCKET_PORT = 8998;

const mutiEntry = (info: any) => {
  const inputModule = {};
  const moduleEntry = [];
  for (const key in info) {
    inputModule[key] = path.resolve(__dirname, info[key].html || info[key].entry);
    moduleEntry.push(info[key].entry);
  }
  return { inputModule, moduleEntry };
};

function refresh() {
  let socket: WebSocket;
  return {
    name: 'extension-refresh',
    configResolved() {
      const wss = new WebSocketServer({ port: SOCKET_PORT });
      wss.on('connection', function connection(ws) {
        console.log('[webSocket] Client connected.');
        ws.on('close', () => console.log('[webSocket] Client disconnected.'));
        socket = ws;
      });
    },

    writeBundle() {
      if (socket) {
        socket.send('HMR_UPDATE');
      }
    }
  };
}

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
      }),
      refresh(),
      UnoCSS()
    ],
    define: {
      SOCKET_PORT: JSON.stringify(SOCKET_PORT)
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '@bg': path.join(__dirname, './src/__background'),
        '@ct': path.join(__dirname, './src/__content'),
        '@pp': path.join(__dirname, './src/__popup')
      }
    },
    envPrefix: 'VITE_',
    server: {},
    build: {
      minify: false,
      outDir: env.VITE_OUTDIR,
      sourcemap: 'inline',
      emptyOutDir: true,
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
