import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [
      ['src/http/controllers/**', './vitest-env/prisma.ts'],
    ],
    globals: true,
    coverage: {
      all: false,
    },
  },
})
