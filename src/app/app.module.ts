import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { SnomedNavbarComponent } from './components/common/snomed-navbar/snomed-navbar.component';
import { SnomedFooterComponent } from './components/common/snomed-footer/snomed-footer.component';
import { EnvServiceProvider } from './providers/env.service.provider';
import {ToastrModule} from 'ngx-toastr';
import {AppRoutingModule} from './app-routing.module';
import {ModalService} from './services/modal/modal.service';
import {TextFilterPipe} from './pipes/text-filter/text-filter.pipe';
import { MemberManagementComponent } from "./components/admin/member-management/member-management.component";
import { StaffTopNavComponent } from "./components/common/staff-top-nav/staff-top-nav.component";
import { SideNavComponent } from "./components/common/side-nav/side-nav.component";
import { AdminFooterComponent } from "./components/common/admin-footer/admin-footer.component";
import { CookieService } from 'ngx-cookie-service';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url';

// SERVICE IMPORTS
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

// SERVICE IMPORTS
Quill.register('modules/magicUrl', MagicUrl)


@NgModule({
    declarations: [
        AppComponent,
        SnomedNavbarComponent,
        SnomedFooterComponent,
        TextFilterPipe
    ],
    imports: [
    BrowserModule,
    FormsModule,
    NgbTypeaheadModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    MemberManagementComponent,
    StaffTopNavComponent,
    SideNavComponent,
    AdminFooterComponent,
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
          deps: [HttpClient]
        }
      }),
],
    providers: [
        ModalService,
        EnvServiceProvider,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        },
        CookieService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
