import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import 'zone.js';
import "@angular/localize/init";

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
