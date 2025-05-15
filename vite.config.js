import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),            // פלאגין React
  ],
  base: '/',            // הגדרת הבסיס ליישום
  resolve: {
    alias: {
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
    exclude: ['framer-motion'],               // חריגים מתהליך האופטימיזציה
    include: ['chart.js', 'react-chartjs-2']  // כלול במפורש
  },
  server: {
    port: 3000,   // פורט ה־Dev Server
    proxy: {
      '/api': {
        target: 'https://api.esclick.co.il',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    },
    watch: {
      // התעלמות מתיקיית .history (מונע HMR כשקבצים שם משתנים)
      ignored: ['**/.history/**']
    }
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')  // קובץ ה־HTML הראשי
    }
  },
  define: {
    // הגדרת NODE_ENV לשימוש בקוד שלך
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});
