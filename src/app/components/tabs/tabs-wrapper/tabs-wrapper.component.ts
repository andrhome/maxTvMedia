import {AfterViewInit, Component, ContentChildren, HostListener, QueryList} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {TabItemComponent} from '../tab-item/tab-item.component';
import {UrlService} from '../../../services/url.service';

declare const $: any;
declare const window: any;

@Component({
    selector: 'tabs-wrapper',
    templateUrl: './tabs-wrapper.component.html',
    styleUrls: ['./tabs-wrapper.component.scss'],
})
export class TabsWrapperComponent implements AfterViewInit {
    @ContentChildren(TabItemComponent) tabs: QueryList<TabItemComponent>;
    offset = 0;
    windowWidth = $(window).width();

    get scrollMode() {
        const isMiniNavBar       = $('body').hasClass('mini-navbar');
        const isOpenDetailedView = $('.mainPartPage').hasClass('showDetailedView');

        return (!isMiniNavBar && isOpenDetailedView  && this.windowWidth < 1300) ||
        (isMiniNavBar  && isOpenDetailedView  && this.windowWidth < 1180) || false;
    }

    get offsetStyle() {
        return this.sanitizer.bypassSecurityTrustStyle(`translateX(${this.offset}px)`);
    }

    constructor(public urlService: UrlService, private sanitizer: DomSanitizer) {}

    ngAfterViewInit() {
        this.urlService.onUrlChange.subscribe(() => this.setActiveTab());
    }

    setActiveTab() {
        setTimeout(() => {
            this.tabs.toArray().forEach((t) => t.active = false);
            const tab = this.tabs.toArray().find(
                (t) => t.tabId === this.urlService.queryParams['tab']
            ) || this.tabs.first;
            tab.active = true;
        });
    }

    selectTab(tab: TabItemComponent) {
        if (this.isActiveTab(tab.tabId)) return; // игнорим клик но активной вкладке
        this.tabs.toArray().forEach((t) => t.active = false);
        tab.active = true;
        this.urlService.queryParams['order-by'] = null;
        this.urlService.setQueryParams(tab.tabId, 1);
    }

    isActiveTab(tabId: string) {
        return this.urlService.queryParams['tab'] === tabId;
    }

    moveRight() {
        if (this.offset < 0) this.offset = this.offset + 50;
    }

    moveLeft() {
        const hiddenWidth = $('.nav-tabs').width() - $('.nav-tabs-wrap').width();
        if (this.offset > -hiddenWidth + 50) this.offset = this.offset - 50;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

}
