import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import MagicUrl from 'quill-magic-url';
import Quill from 'quill';
import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { appRoutes } from './app.routes';
import { ModalService } from './services/modal/modal.service';
import { EnvServiceProvider } from './providers/env.service.provider';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

Quill.register('modules/magicUrl', MagicUrl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      NgbTypeaheadModule,
      NgbModule,
      ToastrModule.forRoot(),
      QuillModule.forRoot({
        modules: {
          magicUrl: {
            urlRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)|(tel:[\S]+)/g,
            globalRegularExpression: /(https?:\/\/|www\.|tel:)[\S]+/g,
          },
        },
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes, withHashLocation(), withEnabledBlockingInitialNavigation(), withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })),
    provideAnimations(),
    ModalService,
    EnvServiceProvider,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    },
  ]
};