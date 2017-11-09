import {Routes} from '@angular/router';
import {AuthGuard} from './services/authentication.service';

// Views components
import {HomeComponent} from './views/home/home.component';
import {LoginComponent} from './views/login/login.component';
import {DirectoryComponent} from './views/directory/directory.component';
import {ParcelsComponent} from './views/parcels/parcels.component';

import {BasicLayoutComponent} from './layouts/basic/basic.component';
import {BlankLayoutComponent} from './layouts/blank/blank.component';
import {DirectoryItemComponent} from './views/directory-item/directory-item.component';

import {InfoComponent} from './views/directory-item/info/info.component';
import {ResidentsComponent} from './views/directory-item/residents/residents.component';
import {ParkingSpotsComponent} from './views/directory-item/parking-spots/parking-spots.component';
import {LockersComponent} from './views/directory-item/lockers/lockers.component';
import {VehiclesComponent} from './views/directory-item/vehicles/vehicles.component';
import {PetsComponent} from './views/directory-item/pets/pets.component';
import {BikeRacksComponent} from './views/directory-item/bike-racks/bike-racks.component';
import {ItemActivityComponent} from './views/directory-item/activity/activity.component';

import {EmailComponent} from './views/email/email.component';
import {ComposeEmailComponent} from './views/email/compose-email/compose-email.component';
import {SettingsComponent} from './views/settings/settings.component';
import {ThemeListComponent} from './views/admin/themes/theme-list.component';
import {CompanyListComponent} from './views/admin/property-company/company-list.component';
import {DocumentsComponent} from './views/documents/documents.component';

export const ROUTES: Routes = [
    // Main redirect
    {path: '', redirectTo: 'directory', pathMatch: 'full'},

    // App views
    {
        path: '', component: BlankLayoutComponent,
        children: [
            {path: 'login', component: LoginComponent},
        ]
    },
    {
        path: '', component: BasicLayoutComponent, canActivate: [AuthGuard],
        children: [
            {path: 'home', component: HomeComponent },
            {path: 'directory', component: DirectoryComponent },
            {
                path: 'directory/item/:id', component: DirectoryItemComponent,
                children: [
                    {path: '', redirectTo: 'info', pathMatch: 'full'},
                    {path: 'info', component: InfoComponent},

                    {path: 'residents', component: ResidentsComponent},
                    {path: 'residents/:id', component: ResidentsComponent},

                    {path: 'parking-spots', component: ParkingSpotsComponent},
                    {path: 'parking-spots/:id', component: ParkingSpotsComponent},

                    {path: 'lockers', component: LockersComponent},
                    {path: 'lockers/:id', component: LockersComponent},

                    {path: 'vehicles', component: VehiclesComponent},
                    {path: 'vehicles/:id', component: VehiclesComponent},

                    {path: 'pets', component: PetsComponent},
                    {path: 'pets/:id', component: PetsComponent},

                    {path: 'bike-racks', component: BikeRacksComponent},
                    {path: 'bike-racks/:id', component: BikeRacksComponent},

                    {path: 'activity', redirectTo: 'activity/directory'},
                    {path: 'activity/directory', component: ItemActivityComponent},
                    {path: 'activity/parcels', component: ItemActivityComponent}
                ]
            },
            {path: 'parcels',             component: ParcelsComponent },
            {path: 'email-merge',         component: EmailComponent },
            {path: 'email-merge/compose', component: ComposeEmailComponent },
            {path: 'documents', component: DocumentsComponent },
            {path: 'settings',            component: SettingsComponent },
            {path: 'property-company',    component: CompanyListComponent },
            {path: 'buildings',           component: SettingsComponent },
            {path: 'themes',              component: ThemeListComponent },
        ]
    },

    // Handle all other routes
    {path: '**', redirectTo: 'home'}
];
