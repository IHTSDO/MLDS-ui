import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import 'zone.js';
import "@angular/localize/init";
import { ModalService } from './app/services/modal/modal.service';
import { EnvServiceProvider } from './app/providers/env.service.provider';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { HeaderInterceptor } from './app/interceptors/header.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app/app.routes';
import { ToastrModule } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import MagicUrl from 'quill-magic-url';
import Quill from 'quill';
import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation, withRouterConfig, withInMemoryScrolling } from '@angular/router';

enableProdMode();

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

Quill.register('modules/magicUrl', MagicUrl);

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, NgbTypeaheadModule, ReactiveFormsModule, NgbModule, ToastrModule.forRoot(), QuillModule.forRoot({
            modules: {
                magicUrl: {
                    urlRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)|(tel:[\S]+)/g,
                    globalRegularExpression: /(https?:\/\/|www\.|tel:)[\S]+/g,
                },
            },
        }), TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })),
        ModalService,
        EnvServiceProvider,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        },
        CookieService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(appRoutes, withHashLocation(), withEnabledBlockingInitialNavigation(), withInMemoryScrolling({scrollPositionRestoration: 'enabled',anchorScrolling: 'enabled'})),
        provideAnimations()
    ]
})
    .catch(err => console.log(err));
