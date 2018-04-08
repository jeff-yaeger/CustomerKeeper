import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { CustformComponent } from './components/custform/custform.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ExcuseComponent } from './components/excuse/excuse.component';
import { AwesomeComponent } from './components/Awesome/awe.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        CustformComponent,
        ProfileComponent,
        AwesomeComponent,
        ExcuseComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'custform', component: CustformComponent },
            { path: 'custform/:id', component: CustformComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'excuse', component: ExcuseComponent },
            { path: 'awesome', component: AwesomeComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
})
export class AppModuleShared {
}
