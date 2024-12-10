import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

Quill.register('modules/magicUrl', MagicUrl)

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient(withFetch()), provideRouter(routes), provideClientHydration(), importProvidersFrom(TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })), provideRouter(routes, withHashLocation()), importProvidersFrom(QuillModule.forRoot({
    modules: {
      magicUrl: {
        urlRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)|(tel:[\S]+)/g,
        globalRegularExpression: /(https?:\/\/|www\.|tel:)[\S]+/g,
      },
    },
  })),
  importProvidersFrom(BrowserAnimationsModule),
  importProvidersFrom(BrowserModule)
  ]

};
