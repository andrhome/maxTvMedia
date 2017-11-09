import {Injectable} from '@angular/core';
import {ApiClientService} from './api-client.service';
import {Parcel} from '../types/data.types';
import {UrlService} from './url.service';
import {EmptyRowService} from './empty-row.service';
import {ConstantsService} from './constants.service';

declare const toastr: any;
declare const swal: any;
declare const $: any;

@Injectable()
export class ParcelsService {
    isParcelModalShow           = false;
    isTransitModalShow          = false;
    isParcelHistoryModalShow    = false;

    parcelInParcelModal: Parcel;
    parcelInHistoryModal: Parcel;
    parcelInTransitModal: Parcel;
    statusInTransitModal: string;

    data = {
        allParcels: {
            get: '/v1/parcels.json?expand=building,suite,resident,receivedBy,pickedUpBy,deliveredBy,parcelHistory,pickedUpByPostService,parcelType,parcelPostService',
            data: [],
            total: null
        },
    };
    tabId = 'allParcels';
    spinnerShow = true;
    parcelTypes:  Array<any> = [];
    postServices: Array<any> = [];
    buildings:    Array<any> = [];

    constructor(
        public api: ApiClientService,
        public urlService: UrlService,
        public emptyRowService: EmptyRowService,
    ) {
        this.api.onLogout.subscribe(() => this.buildings = []);
    }

    getData() {
        this.spinnerShow = true;
        this.data[this.tabId].total = null;

        const tabId       = this.urlService.queryParams['tab'];
        const url         = this.data[tabId].get;
        const queryParams = this.urlService.getQueryParamsString();

        this.api.get('domainParcels', `${url}${queryParams}`).subscribe(
            (res) => {
                const body = JSON.parse(res._body);
                const entities = body.entities;
                this.data[tabId].data = [];
                this.data[tabId].total = body.total;
                this.parcelsFactory(entities, this.data[tabId].data);
                this.emptyRowService.fillEmptyRow();
                this.spinnerShow = false;
            },
            (error) => this.api.errorHandler(error, 'Failed get Parcels')
        );
    }

    parcelsFactory(entities: any, targetArray) {
        entities.forEach((item) => {
            const parcel = new Parcel();
            if (item.id                   ) parcel.id                        = +item.id;
            if (item.suite                ) parcel.suiteId                   = +item.suite.bdId;
            if (item.suite                ) parcel.suiteNumber               = item.suite.suiteNumber;
            if (item.parcelType           ) parcel.parcelTypeId              = +item.parcelType.id;
            if (item.parcelType           ) parcel.parcelTypeName            = item.parcelType.name;
            if (item.parcelPostService    ) parcel.parcelPostServiceId       = +item.parcelPostService.id;
            if (item.parcelPostService    ) parcel.parcelPostServiceName     = item.parcelPostService.name;
            if (item.returningBy          ) parcel.returningById             = item.returningBy.id;
            if (item.returningBy          ) parcel.returningByName           = item.returningBy.name;
            if (item.building             ) parcel.buildingId                = +item.building.bdId;
            if (item.building             ) parcel.buildingName              = item.building.name;
            if (item.resident             ) parcel.residentId                = +item.resident.bdId;
            if (item.resident             ) parcel.residentFullName          = item.resident.fullName;
            if (item.resident             ) parcel.residentEmail             = item.resident.email;
            if (item.receivedBy           ) parcel.receivedById              = +item.receivedBy.id;
            if (item.receivedBy           ) parcel.receivedByFullName        = item.receivedBy.fullName;
            if (item.receivedBy           ) parcel.receivedByEmail           = item.receivedBy.email;
            if (item.pickedUpBy           ) parcel.pickedUpById              = +item.pickedUpBy.id;
            if (item.pickedUpBy           ) parcel.pickedUpByFullName        = item.pickedUpBy.fullName;
            if (item.pickedUpBy           ) parcel.pickedUpByEmail           = item.pickedUpBy.email;
            if (item.deliveredBy          ) parcel.deliveredById             = +item.deliveredBy.id;
            if (item.deliveredBy          ) parcel.deliveredByFullName       = item.deliveredBy.fullName;
            if (item.deliveredBy          ) parcel.deliveredByEmail          = item.deliveredBy.email;
            if (item.barCode              ) parcel.barCode                   = item.barCode;
            if (item.numberPieces         ) parcel.numberPieces              = +item.numberPieces;
            if (item.deliveryAddress      ) parcel.deliveryAddress           = item.deliveryAddress;
            if (item.description          ) parcel.description               = item.description;
            if (item.notes                ) parcel.notes                     = item.notes;
            if (item.status               ) parcel.status                    = item.status;
            if (item.inOut                ) parcel.inOut                     = item.inOut;
            if (item.createdAt            ) parcel.createdAt                 = item.createdAt;
            if (item.pickedUpAt           ) parcel.pickedUpAt                = item.pickedUpAt;
            if (item.pickedUpByPostService) parcel.pickedUpByPostService     = item.pickedUpByPostService.id;
            if (item.pickedUpByPostService) parcel.pickedUpByPostServiceName = item.pickedUpByPostService.name;
            if (item.parcelHistory        ) parcel.parcelHistory             = item.parcelHistory;
            if (item.parcelNumber         ) parcel.parcelNumber              = item.parcelNumber;
            if (item.signUrl              ) parcel.signUrl                   = item.signUrl;
            if (item.emailNotice          ) parcel.emailNotice               = true;
            targetArray.push(parcel);
        });
    }

    getParcelTypes(): void {
        if (this.parcelTypes.length) return;
        const url = `/v1/parcel-types.json?per-page=1000`;
        this.api.get('domainParcels', url).subscribe(
            (res)   => this.parcelTypes = JSON.parse(res._body).entities,
            (error) => this.api.errorHandler(error, 'Failed get parcel types')
        );
    }

    getPostServices(): void {
        if (this.buildings.length) return;
        const url = `/v1/post-services.json?per-page=1000`;
        this.api.get('domainParcels', url).subscribe(
            (res)   => this.postServices = JSON.parse(res._body).entities,
            (error) => this.api.errorHandler(error, 'Failed get post-services')
        );
    }

    getBuildings(): void {
        if (this.buildings.length) return;
        const url = `/v1/buildings.json?per-page=1000`;
        this.api.get('domainBD', url).subscribe(
            (res)   => this.buildings = JSON.parse(res._body).entities,
            (error) => this.api.errorHandler(error, 'Failed get buildings')
        );
    }

    resetData() {
        for (const item in this.data) {
            this.data[item].data = [];
            this.data[item].total = null;
        }
    }

    editParcel(parcel: Parcel) {
        this.isParcelModalShow   = true;
        this.parcelInParcelModal = Object.assign({}, parcel);
    }

    remove(id: number): void {
        if (!id) return;
        swal(ConstantsService.getSwalConfig('Delete parcel'),
            () => {
                const url = `/v1/parcels/${id}`;
                this.api.remove('domainParcels', url).subscribe(
                    () => {
                        toastr.success('Parcel has been deleted.');
                        this.getData();
                    },
                    (error) => this.api.errorHandler(error, 'Delete data failed')
                );
            }
        );
    }

    showHistory(parcel: Parcel) {
        this.isParcelHistoryModalShow = true;
        this.parcelInHistoryModal = parcel;
    }

    showTransitModal(parcel: Parcel, status: string) {
        this.parcelInTransitModal = parcel;
        this.statusInTransitModal = status;
        this.isTransitModalShow = true;
    }

}
