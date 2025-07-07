import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['gsap', 'locomotive-scroll', 'split-type']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['gsap', 'locomotive-scroll', 'split-type']
  }
});