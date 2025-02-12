import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideState, provideStore } from '@ngrx/store';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { storeFeature } from './store/store.feature';

/** Defines the application configuration, including providers for routing, store, and change detection. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(),
    provideState(storeFeature)
  ]
};
