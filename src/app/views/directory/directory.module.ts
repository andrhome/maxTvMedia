import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {TabsModule} from '../../components/tabs/tabs.module';
import {CommonComponentsModule} from '../../common-components.module';
import {ResidentViewModule} from '../../components/directory/detailed-view/resident-view/resident-view.module';

import {DirectoryComponent} from './directory.component';

import {ResidentsListComponent} from '../../components/directory/list/residents-list/residents-list.component';
import {UnitsListComponent} from '../../components/directory/list/units-list/units-list.component';
import {ParkingSpotsListComponent} from '../../components/directory/list/parking-spots-list/parking-spots-list.component';
import {LockersListComponent} from '../../components/directory/list/lockers-list/lockers-list.component';
import {VehiclesListComponent} from '../../components/directory/list/vehicles-list/vehicles-list.component';
import {PetsListComponent} from '../../components/directory/list/pets-list/pets-list.component';
import {BikeRacksListComponent} from '../../components/directory/list/bike-racks-list/bike-racks-list.component';

import {UnitViewComponent} from '../../components/directory/detailed-view/unit-view/unit-view.component';
import {ParkingSpotViewComponent} from '../../components/directory/detailed-view/parking-spot-view/parking-spot-view.component';
import {LockerViewComponent} from '../../components/directory/detailed-view/locker-view/locker-view.component';
import {VehicleViewComponent} from '../../components/directory/detailed-view/vehicle-view/vehicle-view.component';
import {PetViewComponent} from '../../components/directory/detailed-view/pet-view/pet-view.component';
import {BikeRackViewComponent} from '../../components/directory/detailed-view/bike-rack-view/bike-rack-view.component';

import {CreateModalModule} from '../../components/directory/create-modal/create-modal.module';
import {FieldsModule} from '../../components/fields/fields.module';
import {DirectoryService} from '../../services/directory.service';

@NgModule({
    imports: [
        BrowserModule,
        TabsModule,
        FormsModule,
        RouterModule,
        CommonComponentsModule,
        ResidentViewModule,
        FieldsModule,
        CreateModalModule
    ],
    declarations: [
        DirectoryComponent,
        ResidentsListComponent,
        UnitsListComponent,
        ParkingSpotsListComponent,
        LockersListComponent,
        VehiclesListComponent,
        PetsListComponent,
        BikeRacksListComponent,

        UnitViewComponent,
        ParkingSpotViewComponent,
        LockerViewComponent,
        VehicleViewComponent,
        PetViewComponent,
        BikeRackViewComponent,
    ],
    providers: [
        DirectoryService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DirectoryModule {
}
