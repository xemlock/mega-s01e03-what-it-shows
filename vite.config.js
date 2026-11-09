import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) } })],
      adapter: adapter(),
      prerender: { handleHttpError: 'warn' },
    }),
  ],
});
