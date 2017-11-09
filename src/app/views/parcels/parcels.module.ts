import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {TabsModule} from '../../components/tabs/tabs.module';
import {CommonComponentsModule} from '../../common-components.module';

import {ParcelsService} from '../../services/parcels.service';

import {ParcelsComponent} from './parcels.component';
import {ParcelModalComponent} from './parcel-modal/parcel-modal.component';
import {ParcelHistoryComponent} from './parcel-history/parcel-history.component';
import {TransitParcelModalComponent} from './transit-parcel-modal/transit-parcel-modal.component';
import {ParcelsListComponent} from './parcels-list/parcels-list.component';
import {ParcelsFilterComponent} from '../../components/parcels-filter/parcels-filter.component';
import {DatetimeModule} from '../../components/datetime/datetime.module';

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
        ParcelsComponent,
        ParcelsListComponent,
        ParcelModalComponent,
        ParcelHistoryComponent,
        TransitParcelModalComponent,
        ParcelsFilterComponent
    ],
    providers: [
        ParcelsService
    ]
})
export class ParcelsModule {
}

