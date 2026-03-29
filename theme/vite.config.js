import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: './index.js',
      fileName: 'index',
      formats: ['es', 'cjs'],
      name: 'jsonresumeThemeEven',
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies), /^node:.*/],
    },
    target: 'esnext',
  },
})
