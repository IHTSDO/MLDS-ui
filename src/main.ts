import { enableProdMode } from '@angular/core';
import 'zone.js';
import "@angular/localize/init";
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

enableProdMode();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
