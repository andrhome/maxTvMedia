import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CommonComponentsModule} from '../../../common-components.module';
import {EmailService} from '../../../services/email.service';
import {ComposeEmailComponent} from './compose-email.component';
import {ChoiceRecipientsComponent} from '../choice-recipients-modal/choice-recipients-modal.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        CommonComponentsModule,
    ],
    declarations: [
        ComposeEmailComponent,
        ChoiceRecipientsComponent
    ],
    providers: [
        EmailService
    ]
})
export class ComposeEmailModule {
}

