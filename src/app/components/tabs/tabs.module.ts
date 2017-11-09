import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {TabItemComponent} from './tab-item/tab-item.component';
import {TabsWrapperComponent} from './tabs-wrapper/tabs-wrapper.component';

@NgModule({
    imports: [
        BrowserModule,
    ],
    exports: [
        TabItemComponent,
        TabsWrapperComponent
    ],
    declarations: [
        TabItemComponent,
        TabsWrapperComponent
    ]
})
export class TabsModule {
}
