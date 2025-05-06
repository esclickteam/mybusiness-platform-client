import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], // הוספת פלאגין React
  base: '/', // הגדרת הבסיס ליישום
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api.js'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '#minpath': path.resolve(__dirname, 'node_modules/minpath/index.js'),
      '#minproc': path.resolve(__dirname, 'node_modules/minproc/index.js'),
      '#minurl': path.resolve(__dirname, 'node_modules/minurl/index.js'),
      'react-markdown': 'markdown-to-jsx'
    }
  },
  optimizeDeps: {
    exclude: ['framer-motion'], // מומלץ להחריג מודולים שלא מתאימים
    include: ['chart.js', 'react-chartjs-2'] // מודולים שצריכים לכלול אותם בתהליך האופטימיזציה
  },
  server: {
    port: 3000, // הגדרת פורט השרת
    proxy: {
      '/api': {
        target: 'https://api.esclick.co.il',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    }
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html') // נתיב לקובץ ה־HTML הראשי
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) // הגדרת משתנה סביבתי ל־NODE_ENV
  }
});
