import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vue from '@astrojs/vue';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // output: 'server',
  integrations: [
    vue({
      appEntrypoint: '/src/pages/_app',
    }),
    react(),
  ],
  // adapter: node({
  //   mode: 'standalone',
  // }),
  // For OS windows, Uncomment this code
  /* vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  } */
  vite: {
    ssr: {
      noExternal: ['primereact'], // Add your library here
    },
  },
});
