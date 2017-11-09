import {Component, OnDestroy, OnInit} from '@angular/core';
import {DirectoryService} from '../../services/directory.service';
import {UrlService} from '../../services/url.service';

declare const $: any;
declare const toastr: any;

@Component({
    templateUrl: 'directory.component.html'
})

export class DirectoryComponent implements OnInit, OnDestroy {
    currentTabId: string;
    spinnerShow = false;
    tabTitles = {
        'residents'     :  'Residents'    ,
        'units'         :  'Units'        ,
        'parking-spots' :  'Parking Spots',
        'lockers'       :  'Lockers'      ,
        'vehicles'      :  'Vehicles'     ,
        'pets'          :  'Pets'         ,
        'bike-racks'    :  'Bike Racks'   ,
    };

    constructor(
        public directoryService: DirectoryService,
        public urlService: UrlService
    ) {}

    ngOnInit() {
        this.urlService.getQueryParams();
        this.urlService.onUrlChange.subscribe(() => {
            this.directoryService.showDetailedView = false;
            this.directoryService.selectedItemData = null;
            this.directoryService.currentTabId = this.currentTabId = this.urlService.queryParams['tab'];
            this.directoryService.getData();

            const b = this.urlService.queryParams.building;
            if (this.directoryService.buildings.length > 1) this.directoryService.selectedBuilding = b;
        });

        this.directoryService.onDataSend.subscribe(() => this.spinnerShow = true);
        this.directoryService.onDataReceived.subscribe(() => this.spinnerShow = false);
        this.directoryService.onDataUpdated.subscribe(() => {
            this.urlService.setQueryParams();
        });
        this.directoryService.getBuildings();
        this.directoryService.getCountries();

        let tabId = this.urlService.queryParams.tab || 'residents';
        if (!this.directoryService.directoryData[tabId]) tabId = 'residents';
        this.urlService.setQueryParams(tabId);
    }

    ngOnDestroy() {
        this.removeAllObservers();
        this.directoryService.resetDirectoryData();
        this.urlService.resetQueryParams();
    }

    getActiveTabTitle() {
        const tabId = this.urlService.queryParams['tab'];
        return this.tabTitles[tabId] ? this.tabTitles[tabId].slice(0, -1) : '';
    }

    removeAllObservers() {
        this.directoryService.onDataReceived.observers = [];
        this.directoryService.onDataSend.observers = [];
        this.directoryService.onDataUpdated.observers = [];
        this.directoryService.onToggleDetailedView.observers = [];
        this.urlService.onUrlChange.observers = [];
    }

}


