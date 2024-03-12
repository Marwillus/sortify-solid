import { defineConfig } from 'vite';
import macrosPlugin from 'vite-plugin-babel-macros';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid(), macrosPlugin()],
})
