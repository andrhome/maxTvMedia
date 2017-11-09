import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {FilterComponent} from './components/filter/filter.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {PaginationComponent} from './components/pagination/pagination.component';
import {RecipientsFilterViewComponent} from './components/email-merge/recipients-filter-view/recipients-filter-view.component';
import {ViewAttachmentModalComponent} from './views/email/view-attachment-modal/view-attachment-modal.component';
import {SearchSelectComponent} from './components/search-select/search-select.component';
import {SvgCheckedComponent} from './components/svg/checked.component';
import {SvgHalfCheckedComponent} from './components/svg/halfchecked.component';

@NgModule({
    imports: [
        FormsModule,
        HttpModule,
        BrowserModule
    ],
    declarations: [
        FilterComponent,
        SpinnerComponent,
        PaginationComponent,
        RecipientsFilterViewComponent,
        ViewAttachmentModalComponent,
        SearchSelectComponent,
        SvgCheckedComponent,
        SvgHalfCheckedComponent
    ],
    exports: [
        FilterComponent,
        SpinnerComponent,
        PaginationComponent,
        RecipientsFilterViewComponent,
        ViewAttachmentModalComponent,
        SearchSelectComponent,
        SvgCheckedComponent,
        SvgHalfCheckedComponent
    ],
})
export class CommonComponentsModule {
}
