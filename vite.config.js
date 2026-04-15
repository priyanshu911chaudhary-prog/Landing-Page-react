import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function packageChunkName(id) {
  const normalized = id.split('node_modules/')[1]
  if (!normalized) return 'vendor-misc'

  const parts = normalized.split('/')
  const rawPkg = parts[0].startsWith('@') && parts[1]
    ? `${parts[0]}/${parts[1]}`
    : parts[0]

  return `vendor-${rawPkg.replace('@', '').replace('/', '-')}`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) {
            return 'vendor-r3f'
          }

          if (id.includes('gsap') || id.includes('@gsap') || id.includes('lenis') || id.includes('framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'vendor-react'
          }

          return packageChunkName(id)
        },
      },
    },
  },
  server: {
    allowedHosts: [
      '.trycloudflare.com'
    ]
  }
})
