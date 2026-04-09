import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import requireTransform from 'vite-plugin-require-transform';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    cesium(),
    requireTransform({
      fileRegex: /\.(js|jsx)$/
    }),
  ],
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './src/assets'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/proxy': {
        target: 'http://161.118.238.100:8080/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Proxy] ${req.method} ${req.url} -> ${options.target}${proxyReq.path}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Proxy Error]', err.message);
          });
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'slash-div', 'global-builtin', 'color-functions', 'if-function', 'abs-percent', 'duplicate-var-flags', 'function-units'],
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
