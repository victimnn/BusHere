import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@web': path.resolve(__dirname, './src'),
      '@mobile': path.resolve(__dirname, '../mobile'),
      '@server': path.resolve(__dirname, '../server/src'),
      '@shared': path.resolve(__dirname, '../shared'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [
          path.resolve(__dirname, 'node_modules/bootstrap/scss')
        ]
      }
    }
  },
  server: { // Add this server configuration block
    allowedHosts: [ // Add the allowedHosts array
      'api-do-tcc.onrender.com' // Add the specific host that is being blocked
      // You can add more hosts here if needed, separated by commas
    ]
  }
});