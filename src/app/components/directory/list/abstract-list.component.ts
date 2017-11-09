import {HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {BikeRack, Pet, Vehicle, Locker, ParkingSpot, Resident, Unit} from '../../../types/data.types';
import {DirectoryService} from '../../../services/directory.service';
import {UrlService} from '../../../services/url.service';
import {EmptyRowService} from '../../../services/empty-row.service';

declare const $: any;

export class AbstractListComponent implements OnInit, OnDestroy {
    s: Array<Subscription> = [];
    data: Array<Resident|Unit|ParkingSpot|Locker|Vehicle|Pet|BikeRack> = [];

    constructor(
        public directoryService: DirectoryService,
        public urlService: UrlService,
        public emptyRowService: EmptyRowService,
    ) {}

    ngOnInit() {
        this.s.push(this.directoryService.onToggleDetailedView.subscribe(
            (data) => { if (!data) this.uncheckItem(); })
        );
    }

    ngOnDestroy(): void {
        this.s.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    toggleCheck(selectedItem): void {
        const checked = selectedItem.checked;
        this.uncheckItem();
        if (checked) {
            this.directoryService.toggleDetailedView(null, false);
        } else {
            selectedItem.checked = true;
            this.directoryService.toggleDetailedView(selectedItem, true);
        }
    }

    uncheckItem(): void {
        this.data.forEach((item) => item.checked = false);
    }

    orderBy(orderBy: string, $event) {
        if (this.data.length < 2) return;
        this.urlService.orderBy(orderBy, $event);
    }

    fillEmptyRow() {
        this.emptyRowService.fillEmptyRow();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.fillEmptyRow();
    }

}
