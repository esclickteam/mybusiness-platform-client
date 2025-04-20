import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api.js'), // ✅ זה מוסיף import פשוט מ־@api
      '@components': path.resolve(__dirname, 'src/components'), // לדוגמה
      '@pages': path.resolve(__dirname, 'src/pages'), // אופציונלי
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
    port: 3000
  }
})
