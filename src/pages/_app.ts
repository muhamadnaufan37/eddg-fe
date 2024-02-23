import type { App } from 'vue';

import PrimeVue from 'primevue/config';

export default (app: App) => {
  app.use(PrimeVue, { ripple: true });
};
