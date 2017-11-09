import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {ROUTES} from './app.routes';
import {AppComponent} from './app.component';
import {AuthGuard} from './services/authentication.service';

// App views
import {LoginModule} from './views/login/login.module';
import {HomeModule} from './views/home/home.module';
import {DirectoryModule} from './views/directory/directory.module';
import {ParcelsModule} from './views/parcels/parcels.module';
import {DirectoryItemModule} from './views/directory-item/directory-item.module';
import {ComposeEmailModule} from './views/email/compose-email/compose-email.module';

import {LayoutsModule} from './layouts/layouts.module';

import {ApiClientService} from './services/api-client.service';
import {UrlService} from './services/url.service';
import {EmailModule} from './views/email/email.module';
import {SettingsModule} from './views/settings/settings.module';
import {DocumentsModule} from './views/documents/documents.module';
import {CustomStyleService} from './services/custom-style.service';
import {EmptyRowService} from './services/empty-row.service';
import {AdminModule} from './views/admin/admin.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,

        LayoutsModule,

        // Views
        HomeModule,
        LoginModule,
        DirectoryModule,
        DirectoryItemModule,
        ParcelsModule,
        EmailModule,
        ComposeEmailModule,
        SettingsModule,
        DocumentsModule,
        AdminModule,

        RouterModule.forRoot(ROUTES)
    ],
    declarations: [
        AppComponent
    ],
    exports: [],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy,
        },
        AuthGuard,
        ApiClientService,
        UrlService,
        CustomStyleService,
        EmptyRowService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
