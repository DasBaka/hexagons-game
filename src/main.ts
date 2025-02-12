import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

/* eslint-disable */
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
/* eslint-enable */
