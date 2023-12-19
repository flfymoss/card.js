import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        footer: '/*! mitt ::: MIT License (C) Jason Miller , UPNG.js ::: MIT License (C) photopea */'
      },
    }
  },
});
