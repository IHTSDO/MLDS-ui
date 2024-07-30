import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import { MemberManagementComponent } from './components/member-management/member-management.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authguardGuard } from './auth/authguard.guard';
import { LandingContentComponent } from './components/landing-content/landing-content.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent,
        children:[
            {path:'', component: LandingContentComponent},
            {path:'login', component: LoginComponent}
        ]
    },
    { path: 'member', component: DashboardComponent, canActivate: [authguardGuard] },
    { path: 'landing/:memberKey', component: LandingPageComponent,
        children:[
            {path:'', component: LandingContentComponent},
            {path:'login', component: LoginComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
