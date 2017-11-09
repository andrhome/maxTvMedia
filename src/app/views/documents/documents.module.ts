import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {TabsModule} from '../../components/tabs/tabs.module';
import {CommonComponentsModule} from '../../common-components.module';

import {DocumentsService} from '../../services/documents.service';

import {DocumentsComponent} from './documents.component';
import {DocumentsListComponent} from './documents-list/documents-list.component';
import {DocumentsViewComponent} from './documents-view-modal/documents-view-modal.component';
import {CreateFolderModalComponent} from './create-folder-modal/create-folder-modal.component';
import {DatetimeModule} from '../../components/datetime/datetime.module';
import {DocumentsFilterComponent} from '../../components/documents/documents-status-filter/documents-status-filter.component';
// import {MailingResultComponent} from './mailing-result-modal/mailing-result-modal.component';

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
        DocumentsComponent,
        DocumentsListComponent,
        DocumentsViewComponent,
        CreateFolderModalComponent,
        DocumentsFilterComponent,
        // MailingResultComponent
    ],
    providers: [
        DocumentsService
    ]
})
export class DocumentsModule {
}

