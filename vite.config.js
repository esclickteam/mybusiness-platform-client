import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
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
    exclude: ['framer-motion'],
    include: ['chart.js', 'react-chartjs-2']
  },
  server: {
    port: 3000,
    // ✏️ הוספת proxy:
    proxy: {
      // כל קריאה שמתחילה ב־/api תופנה אוטומטית ל־backend שלך
      '/api': {
        target: 'https://api.esclick.co.il',
        changeOrigin: true,   // משנה את ה־Host ל־target
        secure: false,        // אם יש לך SSL self-signed
        rewrite: (path) => path.replace(/^\/api/, '/api') 
        // (בשבילנו זה זהה, אבל אפשר לעדכן אם ברצונך להסיר/להוסיף prefix)
      },
    }
  }
})
