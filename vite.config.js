import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const directories = id.toString().split('node_modules/')[1].split('/');
            // Agrupa por paquete base (ej: react, @azure, etc.)
            const name = directories[0].startsWith('@')
              ? `${directories[0]}/${directories[1]}`
              : directories[0];
            return name;
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Para que no te moleste con el warning
  }
})
