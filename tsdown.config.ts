import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [ 'lib/index.ts' ],
  format: [ 'esm', 'cjs' ],
  fixedExtension: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
