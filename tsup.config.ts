import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  minify: true,
  metafile: false,
  sourcemap: true,
  target: 'esnext',
  outDir: 'dist',
});
