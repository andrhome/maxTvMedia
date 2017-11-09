import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {InputFieldComponent} from './input-field/input-field.component';
import {GroupsFieldComponent} from './groups-field/groups-field.component';
import {AngularMultiSelectModule} from '../angular2-multiselect-dropdown/multiselect.component';
import {TextareaFieldComponent} from './textarea-field/textarea-field.component';
import {DatetimeFieldComponent} from './datetime-field/datetime-field.component';
import {DatetimeModule} from '../datetime/datetime.module';
import {AddressFieldComponent} from './address-field/address-field.component';
import {BooleanFieldComponent} from './boolean-field/boolean-field.component';
import {RoleFieldComponent} from './role-field/role-field.component';
import {PhoneFieldComponent} from './phone-field/phone-field.component';
import {SelectFieldComponent} from './select-field/select-field.component';
import {CarOwnerFieldComponent} from './car-owner-field/car-owner-field.component';
import {ResidentEmailFieldComponent} from './resident-email-field/resident-email-field.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AngularMultiSelectModule,
        DatetimeModule
    ],
    declarations: [
        InputFieldComponent,
        GroupsFieldComponent,
        TextareaFieldComponent,
        DatetimeFieldComponent,
        BooleanFieldComponent,
        AddressFieldComponent,
        RoleFieldComponent,
        PhoneFieldComponent,
        SelectFieldComponent,
        CarOwnerFieldComponent,
        ResidentEmailFieldComponent
    ],
    exports: [
        InputFieldComponent,
        GroupsFieldComponent,
        TextareaFieldComponent,
        GroupsFieldComponent,
        DatetimeFieldComponent,
        BooleanFieldComponent,
        AddressFieldComponent,
        RoleFieldComponent,
        PhoneFieldComponent,
        SelectFieldComponent,
        CarOwnerFieldComponent,
        ResidentEmailFieldComponent
    ]
})
export class FieldsModule {}
