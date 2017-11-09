import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {DatetimeModule} from '../../../datetime/datetime.module';

import {AngularMultiSelectModule} from '../../../angular2-multiselect-dropdown/multiselect.component';

import {ResidentViewComponent} from './resident-view.component';
import {FieldsModule} from '../../../fields/fields.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AngularMultiSelectModule,
        RouterModule,
        DatetimeModule,
        FieldsModule
    ],
    declarations: [
        ResidentViewComponent
    ],
    exports: [
        ResidentViewComponent
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResidentViewModule {
}

