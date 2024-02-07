import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: ['lib'] }),
    svgr({ svgrOptions: { ref: true } })
  ],
  server: {
    port: 5175
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['react', 'react/jsx-runtime']
    }
  },
  resolve: {
    alias: [
      {
        find: /^utils\//,
        replacement: '/lib/utils/'
      },
      {
        find: /^types$/,
        replacement: '/lib/types'
      },
      {
        find: /^hooks$/,
        replacement: '/lib/hooks'
      },
      {
        find: /^generalClasses.module.scss$/,
        replacement: '/lib/style/generalClasses'
      },
      {
        find: /^static\//,
        replacement: '/lib/static/'
      },
      {
        find: /^context\//,
        replacement: '/lib/context/'
      },
      {
        find: /^style\//,
        replacement: '/lib/style/'
      }
    ]
  }
})
