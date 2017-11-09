import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {LoginComponent} from './login.component';

import {AuthenticationService} from '../../services/authentication.service';
import {CommonComponentsModule} from '../../common-components.module';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonComponentsModule
    ],
    providers: [
        AuthenticationService,
    ]
})

export class LoginModule {
}
