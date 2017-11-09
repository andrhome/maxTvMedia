import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ParcelsService} from '../../services/parcels.service';
import {UrlService} from '../../services/url.service';

@Component({
    templateUrl: 'parcels.component.html',
})
export class ParcelsComponent implements OnInit, OnDestroy {

    constructor(public parcelsService: ParcelsService,
                public urlService: UrlService) {
    }

    ngOnInit() {
        this.parcelsService.getPostServices();
        this.parcelsService.getParcelTypes();
        this.parcelsService.getBuildings();

        this.urlService.onUrlChange.subscribe(() => {
            this.parcelsService.tabId = this.urlService.queryParams['tab'];
            this.parcelsService.getData();
        });
        this.urlService.setQueryParams('allParcels');
    }

    ngOnDestroy() {
        this.removeAllObservers();
        this.parcelsService.resetData();
        this.urlService.resetQueryParams();
    }

    removeAllObservers() {
        this.urlService.onUrlChange.observers = [];
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.parcelsService.emptyRowService.fillEmptyRow();
    }

}


