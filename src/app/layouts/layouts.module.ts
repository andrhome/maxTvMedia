import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {BasicLayoutComponent} from './basic/basic.component';
import {BlankLayoutComponent} from './blank/blank.component';

import {NavigationComponent} from '../components/navigation/navigation.component';
import {TopNavBarComponent} from '../components/top-nav-bar/top-nav-bar.component';

@NgModule({
    declarations: [
        BasicLayoutComponent,
        BlankLayoutComponent,

        NavigationComponent,
        TopNavBarComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule,
    ],
    exports: [
        BasicLayoutComponent,
        BlankLayoutComponent,
    ],
})

export class LayoutsModule {
}
