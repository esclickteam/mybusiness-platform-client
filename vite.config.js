import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@':            path.resolve(__dirname, 'src'), 
      '@api':         path.resolve(__dirname, 'src/api.js'),
      '@components':  path.resolve(__dirname, 'src/components'),
      '@pages':       path.resolve(__dirname, 'src/pages'),
      '@context':     path.resolve(__dirname, 'src/context'),
      '#minpath':     path.resolve(__dirname, 'node_modules/minpath/index.js'),
      '#minproc':     path.resolve(__dirname, 'node_modules/minproc/index.js'),
      '#minurl':      path.resolve(__dirname, 'node_modules/minurl/index.js'),
      'react-markdown': 'markdown-to-jsx'
    }
  },
  optimizeDeps: {
    exclude: ['framer-motion'],
    include: ['chart.js', 'react-chartjs-2', 'jwt-decode'],  // Add jwt-decode here
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.bizuply.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    },
    watch: {
      ignored: ['**/.history/**']
    }
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});
