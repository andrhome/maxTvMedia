import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {TabsModule} from '../../components/tabs/tabs.module';
import {CommonComponentsModule} from '../../common-components.module';

import {EmailService} from '../../services/email.service';

import {EmailComponent} from './email.component';
import {EmailListComponent} from './email-list/email-list.component';
import {EmailViewComponent} from './email-view-modal/email-view-modal.component';
import {DatetimeModule} from '../../components/datetime/datetime.module';
import {EmailsFilterComponent} from '../../components/email-merge/emails-status-filter/emails-status-filter.component';
import {MailingResultComponent} from './mailing-result-modal/mailing-result-modal.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        TabsModule,
        RouterModule,
        CommonComponentsModule,
        DatetimeModule
    ],
    declarations: [
        EmailComponent,
        EmailListComponent,
        EmailViewComponent,
        EmailsFilterComponent,
        MailingResultComponent
    ],
    providers: [
        EmailService
    ]
})
export class EmailModule {
}

