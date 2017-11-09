import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {AngularMultiSelectModule} from '../../angular2-multiselect-dropdown/multiselect.component';
import {DatetimeModule} from '../../datetime/datetime.module';

import {ResidentCreateComponent} from './resident-create/resident-create.component';
import {UnitCreateComponent} from './unit-create/unit-create.component';
import {ParkingSpotCreateComponent} from './parking-spot-create/parking-spot-create.component';
import {LockerCreateComponent} from './locker-create/locker-create.component';
import {VehicleCreateComponent} from './vehicle-create/vehicle-create.component';
import {PetCreateComponent} from './pet-create/pet-create.component';
import {BikeRackCreateComponent} from './bike-rack-create/bike-rack-create.component';
import {CommonComponentsModule} from '../../../common-components.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        AngularMultiSelectModule,
        DatetimeModule,
        CommonComponentsModule
    ],
    declarations: [
        ResidentCreateComponent,
        UnitCreateComponent,
        ParkingSpotCreateComponent,
        LockerCreateComponent,
        VehicleCreateComponent,
        PetCreateComponent,
        BikeRackCreateComponent,
    ],
    exports: [
        ResidentCreateComponent,
        UnitCreateComponent,
        ParkingSpotCreateComponent,
        LockerCreateComponent,
        VehicleCreateComponent,
        PetCreateComponent,
        BikeRackCreateComponent,
    ],
    providers: [],
})
export class CreateModalModule {
}
