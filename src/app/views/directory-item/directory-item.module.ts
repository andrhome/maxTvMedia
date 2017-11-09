import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DirectoryItemComponent} from './directory-item.component';

import {FieldsModule} from '../../components/fields/fields.module';
import {CreateModalModule} from '../../components/directory/create-modal/create-modal.module';

import {InfoComponent} from './info/info.component';
import {ResidentsComponent} from './residents/residents.component';
import {ParkingSpotsComponent} from './parking-spots/parking-spots.component';
import {LockersComponent} from './lockers/lockers.component';
import {VehiclesComponent} from './vehicles/vehicles.component';
import {PetsComponent} from './pets/pets.component';
import {BikeRacksComponent} from './bike-racks/bike-racks.component';
import {ItemActivityComponent} from './activity/activity.component';
import {CommonComponentsModule} from '../../common-components.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        FieldsModule,
        CreateModalModule,
        CommonComponentsModule
    ],
    declarations: [
        DirectoryItemComponent,
        InfoComponent,
        ResidentsComponent,
        ParkingSpotsComponent,
        LockersComponent,
        VehiclesComponent,
        PetsComponent,
        BikeRacksComponent,
        ItemActivityComponent
    ],
    providers: [],
})
export class DirectoryItemModule {
}
