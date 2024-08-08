import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { SnomedNavbarComponent } from './components/snomed-navbar/snomed-navbar.component';
import { SnomedFooterComponent } from './components/snomed-footer/snomed-footer.component';
import { EnvServiceProvider } from './providers/env.service.provider';
import {ToastrModule} from 'ngx-toastr';
import {AppRoutingModule} from './app-routing.module';
import {ModalService} from './services/modal/modal.service';
import {ModalComponent} from './components/modal/modal.component';
import {TextFilterPipe} from './pipes/text-filter/text-filter.pipe';
import { MemberManagementComponent } from "./components/member-management/member-management.component";
import { StaffTopNavComponent } from "./components/staff-top-nav/staff-top-nav.component";
import { SideNavComponent } from "./components/side-nav/side-nav.component";
import { AdminFooterComponent } from "./components/admin-footer/admin-footer.component";
import { CookieService } from 'ngx-cookie-service';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// SERVICE IMPORTS


@NgModule({
    declarations: [
        AppComponent,
        SnomedNavbarComponent,
        SnomedFooterComponent,
        ModalComponent,
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
    InfiniteScrollModule,
    AdminFooterComponent
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
