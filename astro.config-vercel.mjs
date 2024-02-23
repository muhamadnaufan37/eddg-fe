import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import node from '@astrojs/node';

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [vue({
    appEntrypoint: '/src/pages/_app'
  }), react()],
  adapter: vercel()
  // For OS windows, Uncomment this code
  /* vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  } */
});
