import {Injectable, EventEmitter} from '@angular/core';
import {ApiClientService} from './api-client.service';
import {Building} from '../types/data.types';
import {UrlService} from './url.service';

declare const toastr: any;

@Injectable()
export class DirectoryService {
    onDataReceived: EventEmitter<any> = new EventEmitter();
    onDataSend:     EventEmitter<any> = new EventEmitter();
    onDataUpdated:  EventEmitter<any> = new EventEmitter();

    currentTabId = 'residents';
    countries: Array<any> = [];
    buildings: Array<any> = [];
    groups:    Array<any> = [];
    petTypes:  Array<any> = [];

    onToggleDetailedView: any = new EventEmitter();
    showDetailedView = false;
    selectedItemData: any;
    showCreateModal = false;
    selectedBuilding: number;

    directoryData = {
        'residents': {
            get: '/v1/suite-users.json?expand=user.phones,user.addresses,user.groups.group,suite,building',
            post: '/v1/suite-users.json',
            patch: '/v1/suite-users/',
            remove: '/v1/suite-users/',
            data: [],
            total: null
        },
        'units': {
            get: '/v1/suites.json?expand=suiteUser.user,building',
            post: '/v1/suites.json',
            patch: '/v1/suites/',
            remove: '/v1/suites/',
            data: [],
            total: null
        },
        'parking-spots': {
            get: '/v1/parking.json?expand=suite,building',
            post: '/v1/parking.json',
            patch: '/v1/parking/',
            remove: '/v1/parking/',
            data: [],
            total: null
        },
        'lockers': {
            get: '/v1/locker.json?expand=suite,building',
            post: '/v1/locker.json',
            patch: '/v1/locker/',
            remove: '/v1/locker/',
            data: [],
            total: null
        },
        'vehicles': {
            get: '/v1/vehicle.json?expand=owner.suiteUser,suite,building',
            post: '/v1/vehicle.json',
            patch: '/v1/vehicle/',
            remove: '/v1/vehicle/',
            data: [],
            total: null
        },
        'pets': {
            get: '/v1/pet.json?expand=suite,building,petType',
            post: '/v1/pet.json',
            patch: '/v1/pet/',
            remove: '/v1/pet/',
            data: [],
            total: null
        },
        'bike-racks': {
            get: '/v1/bike_rack.json?expand=suite,building,rentedTo',
            post: '/v1/bike_rack.json',
            patch: '/v1/bike_rack/',
            remove: '/v1/bike_rack/',
            data: [],
            total: null
        }
    };

    constructor(
        private api: ApiClientService,
        private urlService: UrlService
    ) {
        this.api.onLogout.subscribe(() => this.buildings = []);
    }

    getData() {
        const tabId       = this.urlService.queryParams['tab'];
        const url         = this.directoryData[tabId].get;
        const queryParams = this.urlService.getQueryParamsString();
        this.onDataSend.emit();
        this.directoryData[tabId].data  = [];
        this.directoryData[tabId].total = null;
        this.api.get('domainBD', `${url}${queryParams}`)
            .subscribe((data) => {
                const responseBody              = JSON.parse(data._body);
                this.directoryData[tabId].data  = responseBody.entities;
                this.directoryData[tabId].total = responseBody.total;
                this.onDataReceived.emit({id: tabId, data: responseBody});
            });
    }

    toggleDetailedView(data, state: boolean): void {
        this.selectedItemData = data ? data : null;
        this.showDetailedView = state;
        this.onToggleDetailedView.emit(data);
    }

    resetDirectoryData() {
        for (const item in this.directoryData) {
            this.directoryData[item].data = [];
            this.directoryData[item].total = null;
        }
    }

    getBuildings(): void {
        if (this.buildings.length) return;
        const url = `/v1/buildings.json?per-page=1000`;
        this.api.get('domainBD', url).subscribe(
            (res) => {
                this.buildings = [];
                const entities = JSON.parse(res._body).entities || [];
                entities.forEach((item) => {
                    const building = new Building(item.id, item.name, item.suits);
                    this.buildings.push(building);
                });
                if (this.buildings.length === 1) this.selectedBuilding = this.buildings[0].id;
            },
            (error) => this.api.errorHandler(error, 'Failed get buildings'));
    }

    getCountries(): void {
        if (this.countries.length) return;
        const url = `/v1/country.json?per-page=1000&order-by=countryName|asc`;
        this.api.get('domainBD', url).subscribe(
            (res) => {
                this.countries = [];
                const entities = JSON.parse(res._body).entities || [];
                entities.forEach((item) => {
                    this.countries.push({id: item.id, countryName: item.countryName});
                });
            },
            (error) => this.api.errorHandler(error, 'Failed get countries'));
    }

    getGroups(): void {
        if (this.groups.length) return;
        const url = `/v1/group.json?per-page=1000`;
        this.api.get('domainBD', url).subscribe(
            (res) => {
                this.groups = [];
                const entities = JSON.parse(res._body).entities || [];
                this.groups = entities.map(
                    item => ({id: item.id, itemName: item.name})
                );
            },
            (error) => this.api.errorHandler(error, 'Failed get groups'));
    }

    getPetTypes(): void {
        if (this.petTypes.length) return;
        const url = '/v1/pet_type.json?per-page=1000&order-by=name|asc';
        this.api.get('domainBD', url).subscribe((res) => {
            this.petTypes = JSON.parse(res._body).entities;
        });
    }

     getBuildingNameById(id): string {
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].id === id) return this.buildings[i].name;
        }
        return '';
    }

    getPetTypeNameById(id): string {
        for (let i = 0; i < this.petTypes.length; i++) {
            if (this.petTypes[i].id == id) return this.petTypes[i].name;
        }
        return '';
    }

    getUrl(type: string) {
        return this.directoryData[this.currentTabId][type];
    }

    hideModal() {
        this.showCreateModal = false;
    }

    showModal() {
        this.showCreateModal = true;
    }

}
