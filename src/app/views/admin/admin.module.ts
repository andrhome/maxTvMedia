import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CommonComponentsModule} from '../../common-components.module';
import {FieldsModule} from '../../components/fields/fields.module';
import {AdminService} from '../../services/admin.service';
import {ThemeListComponent} from './themes/theme-list.component';
import {ThemeModalComponent} from './themes/modal/theme-modal.component';
import {CompanyViewComponent} from './property-company/company-view/company-view.component';
import {CompanyListComponent} from './property-company/company-list.component';
import {CompanyModalComponent} from './property-company/company-modal/company-modal.component';
import {OfficeModalComponent} from './property-company/office-modal/office-modal.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        CommonComponentsModule,
        FieldsModule,
    ],
    declarations: [
        ThemeListComponent,
        ThemeModalComponent,
        CompanyListComponent,
        CompanyModalComponent,
        CompanyViewComponent,
        OfficeModalComponent
    ],
    providers: [
        AdminService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {
}
