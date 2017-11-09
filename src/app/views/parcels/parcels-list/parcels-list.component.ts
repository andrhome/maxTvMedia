import {Component, HostListener} from '@angular/core';
import {ParcelsService} from '../../../services/parcels.service';
import {UrlService} from '../../../services/url.service';

declare const toastr: any;
declare const $: any;

@Component({
    selector: 'parcels-list',
    templateUrl: './parcels-list.component.html',
    styleUrls: ['./parcels-list.component.scss']
})
export class ParcelsListComponent {

    constructor(
        public urlService: UrlService,
        public parcelsService: ParcelsService
    ) {}

    orderBy(orderBy: string, $event) {
        if (this.parcelsService.data.allParcels.total < 2) return;
        this.urlService.orderBy(orderBy, $event);
    }

    showHint(e) {
        const $td = $(e.target).closest('.parcels-hint-td');
        if ($td.hasClass('active'))
            $td.removeClass('active');
        else {
            $('.parcels-hint-td').removeClass('active');
            $td.addClass('active');
        }
    }

    @HostListener('document:click', ['$event.target'])
    hideHint(targetElement: HTMLElement): void {
        if (!$(targetElement).closest('.parcels-hint-td').length) {
            $('.parcels-hint-td').removeClass('active');
        }
    }

}
