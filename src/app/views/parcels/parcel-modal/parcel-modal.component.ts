import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ApiClientService} from '../../../services/api-client.service';
import {ParcelsService} from '../../../services/parcels.service';
import {Parcel, ResidentForSelect} from '../../../types/data.types';
import {UrlService} from '../../../services/url.service';
import {ConstantsService} from '../../../services/constants.service';

declare const toastr: any;
declare const $: any;
declare const swal: any;

@Component({
    selector: 'parcel-modal',
    templateUrl: './parcel-modal.component.html',
})
export class ParcelModalComponent implements OnInit {
    @ViewChild('form') form;
    showModal = false;
    suites: Array<any> = [];
    residents: Array<ResidentForSelect> = [];
    data: Parcel = new Parcel();
    disabledSubmit = false;
    date: string = (new Date).toISOString();
    time = ParcelModalComponent.parseTime((new Date()).toISOString());

    static parseTime(dateString: string): string {
        return (new DatePipe('en-US')).transform(dateString, 'hh:mm a');
    }

    constructor(
        public api: ApiClientService,
        public parcelsService: ParcelsService,
        public urlService: UrlService
    ) {}

    ngOnInit() {
        this.initData();
        this.initTimePicker();
        setTimeout( () => this.showModal = true, 300);
    }

    initTimePicker() {
        $('#timepicker1').timepicker().on('changeTime.timepicker', e => this.time = e.time.value);
    }

    initData() {
        if (this.parcelsService.parcelInParcelModal) {
            this.data = this.parcelsService.parcelInParcelModal;
            this.date = this.data.createdAt;
            this.time = ParcelModalComponent.parseTime(this.data.createdAt);
            this.getSuites(this.data.buildingId, this.data.suiteId);
        } else {
            const b = this.urlService.queryParams['building'];
            if (b) {
                this.data.buildingId = b;
                this.getSuites(this.data.buildingId);
            }

            if (this.parcelsService.buildings.length === 1) {
                this.data.buildingId = this.parcelsService.buildings[0].id;
                this.getSuites(this.data.buildingId);
            }
        }
    }

    hideModal() {
        if (this.form.dirty && this.form.touched) {
            swal(ConstantsService.getSwalConfig('Close without saving?', 'You want to delete unsaved data?'),
                () => {
                    this.parcelsService.isParcelModalShow = false;
                    this.parcelsService.parcelInParcelModal = null;
                }
            );
        } else {
            this.parcelsService.isParcelModalShow = false;
            this.parcelsService.parcelInParcelModal = null;
        }
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            if (!form.value.buildingId) toastr.warning('Building should not be blank.');
            if (!form.value.suiteId)    toastr.warning('Unit should not be blank.');
            if (!form.value.residentId) toastr.warning('Resident should not be blank.');
            return;
        }
        const building = this.parcelsService.buildings.find((item) => item.id == form.value.buildingId);
        const suite    = this.suites.find((item) => item.id == form.value.suiteId);
        const resident = this.residents.find((item) => item.id == form.value.residentId);

        if (!suite)    { toastr.warning('Suite not found.');    return; }
        if (!resident) { toastr.warning('Resident not found.'); return; }

        const data: any = {
            building: {
                bdId: form.value.buildingId,
                name: building ? building.name : null,
            },
            suite: {
                bdId:        suite.id ? form.value.suiteId : 0,
                suiteNumber: suite.id ? suite.name         : form.value.otherSuite,
            },
            resident: {
                bdId:     resident.id ? resident.id       : 0,
                fullName: resident.id ? resident.fullName : form.value.otherResident,
            },
            parcelPostService: form.value.parcelPostServiceId,
            numberPieces:      form.value.numberPieces,
            barCode:           form.value.barCode,
            parcelType:        form.value.parcelTypeId,
            inOut:             form.value.inOut,
            description:       form.value.description,
            createdAt:         this.getDateTimeFromForm()
        };

        if (!this.data.id) data.emailNotice = +form.value.emailNotice;

        if (resident && resident.email) data.resident.email = resident.email;

        this.disabledSubmit = true;

        if (this.data.id) {
            this.api.patch('domainParcels', `/v1/parcels/${this.data.id}.json`, data).subscribe(
                () => this.updateView('Parcel successfully updated'),
                error => {
                    this.disabledSubmit = false;
                    this.api.errorHandler(error, 'Edit parcel failed');
                }
            );
        } else {
            this.api.post('domainParcels', '/v1/parcels.json', data).subscribe(
                () => this.updateView('Parcel successfully created'),
                error => {
                    this.disabledSubmit = false;
                    this.api.errorHandler(error, 'Create parcel failed');
                }
            );
        }
    }

    getDateTimeFromForm(): Date {
        const date = new Date(this.form.value.date);
        const time = this.form.value.time;
        const timeObj = new Date(`01 01 1970 ${time}`);
        const hours   = timeObj.getHours();
        const minutes = timeObj.getMinutes();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }

    updateView(msg: string): void {
        toastr.success(msg);
        this.parcelsService.getData();
        this.form.reset();
        this.hideModal();
    }

    changeBuilding(buildingId: string) {
        this.form.controls['suiteId'].reset();
        this.form.controls['residentId'].reset();
        this.getSuites(+buildingId);
    }

    changeUnit(suiteId: string) {
        this.form.controls['residentId'].reset();
        this.getResidents(+suiteId);
        if (suiteId + '' === '0') {
            this.form.controls['residentId'].setValue(0);
            this.data.residentId = 0;
            this.data.suiteNumber = '';
            this.data.residentFullName = '';
            this.residents.push(new ResidentForSelect(0, 'Other'));
        }
    }

    changeResident(residentId: string) {
        if (residentId === '0') this.data.residentFullName = '';
    }

    getSuites(buildingId: number, suiteId?: number): void {
        if (!buildingId) return;
        this.suites = [];
        this.residents = [];
        const url = `/v1/suites.json?per-page=1000&order-by=suiteNumber|asc&waiver_parcel=1&building_id=${buildingId}`;
        this.api.get('domainBD', url).subscribe(
            res => {
                const suites = JSON.parse(res._body).entities || [];
                suites.forEach(
                    suite => this.suites.push({id: suite.id, name: suite.suiteNumber})
                );
                this.suites.push({id: 0, name: 'Other'});
                if (suiteId) this.getResidents(suiteId);
                else this.residents.push(new ResidentForSelect(0, 'Other'));
            },
            error => this.api.errorHandler(error, 'Failed get suites')
        );
    }

    getResidents(suiteId: number): void {
        this.residents = [];
        if (!suiteId) return;
        const url = `/v1/residents.json?per-page=1000&waiver_parcel=1&suite_id=${suiteId}`;
        this.api.get('domainBD', url).subscribe(
            res => {
                const residents = JSON.parse(res._body).entities;
                residents.forEach(item => {
                    if (item.parcelWaiverSigned) {
                        this.residents.push(
                            new ResidentForSelect(item.id, item.fullName, [], item.email)
                        );
                    }
                });
                this.residents.push(new ResidentForSelect(0, 'Other'));
            },
            error => this.api.errorHandler(error, 'Failed get Residents')
        );
    }

    suiteToSearchSelect(arr: Array<any>) {
        return arr.map(
            suite => (
                {value: suite.id, optionText: suite.name}
            )
        );
    }

}
