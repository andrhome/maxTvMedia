import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {CustomStyleService} from '../../../services/custom-style.service';

declare const $;

@Component({
    templateUrl: 'theme-list.component.html',
    styleUrls: ['theme-list.component.scss']
})
export class ThemeListComponent implements OnInit, OnDestroy {
    constructor(
        public adm: AdminService,
        public cs: CustomStyleService
    ) {}

    ngOnInit() {
        this.adm.urlService.onUrlChange.subscribe(() => {
            this.adm.getThemes();
        });
        this.adm.urlService.setQueryParams('themes');
    }

    ngOnDestroy() {
        this.removeAllObservers();
        this.adm.urlService.resetQueryParams();
    }

    removeAllObservers() {
        this.adm.urlService.onUrlChange.observers = [];
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.adm.emptyRowService.fillEmptyRow();
    }

    showHint(e) {
        const $td = $(e.target).closest('.hint-td');
        if ($td.hasClass('active'))
            $td.removeClass('active');
        else {
            $('.hint-td').removeClass('active');
            $td.addClass('active');
        }
    }

    @HostListener('document:click', ['$event.target'])
    hideHint(targetElement: HTMLElement) {
        if (!targetElement.closest('.hint-td')) $('.hint-td').removeClass('active');
    }

}


