import {OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {Subscription} from 'rxjs/Rx';
import {Resident, Unit, ParkingSpot, Locker, Vehicle, BikeRack, Pet} from '../../../types/data.types';
import {DirectoryService} from '../../../services/directory.service';
import {ApiClientService} from '../../../services/api-client.service';
import {ConstantsService} from '../../../services/constants.service';

declare const $: any;
declare const toastr: any;
declare const swal: any;

export class AbstractDetailedView implements OnInit, OnDestroy {
    @ViewChild('form') form;
    s: Array<Subscription> = [];
    data: Resident|Unit|ParkingSpot|Locker|Vehicle|Pet|BikeRack|any;
    title = '';

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {}

    ngOnInit() {
        this.initData(this.directoryService.selectedItemData);
        this.s.push(this.directoryService.onToggleDetailedView.subscribe((data) => this.initData(data)));
    }

    ngOnDestroy(): void {
        this.s.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    initData(data) {
        if (!data) return;
        this.data = data;
        this.setEditModeForAll(false);
    }

    onSubmit(form: NgForm, formField?) {}

    update(form: NgForm, formField) {
        if (form.invalid) {
            toastr.warning('Send data not valid.');
            if (!form.value.building)      toastr.warning('Building should not be blank.');
            if (!form.value.suiteNumber)   toastr.warning('Unit Number should not be blank.');
            if (!form.value.parkingNumber) toastr.warning('Parking Spot should not be blank.');
            if (!form.value.lockerKeyCode) toastr.warning('Locker number should not be blank.');
            if (!form.value.rackNumber)    toastr.warning('Bike rack number should not be blank.');
            return;
        }

        const data: any = {};
        data[formField] = form.value[formField];

        this.patch(form.value.id, data);
    }

    create(data): void {
        const url = this.directoryService.getUrl('post');
        this.api.post('domainBD', url, data).subscribe(
            (res)   => this.updateView(this.title + ' successfully created'),
            (error) => this.api.errorHandler(error, 'Create failed')
        );
    }

    patch(residentId: number, data): void {
        const url = `${this.directoryService.getUrl('patch')}${residentId}.json`;
        this.api.patch('domainBD', url, data).subscribe(
            (res)   => this.updateView(this.title + ' successfully updated', false),
            (error) => this.api.errorHandler(error, 'Edit failed')
        );
    }

    remove(id: number): void {
        swal(ConstantsService.getSwalConfig('Delete ' + this.title),
            () => {
                const url = this.directoryService.getUrl('remove');
                this.api.remove('domainBD', url + id).subscribe(
                    ()      => this.updateView(this.title + ' has been deleted.'),
                    (error) => this.api.errorHandler(error, 'Delete data failed')
                );
            }
        );
    }

    updateView(msg: string, close = true): void {
        if (msg) toastr.success(msg);
        this.directoryService.getData();
        this.setEditModeForAll(false);
        if (close) this.directoryService.toggleDetailedView(null, false);
    }

    setEditModeFor(item, fieldName: string, state: boolean) {
        this.setEditModeForAll(false);
        item.formFields[fieldName].editMode = state;
    }

    setEditModeForAll(state: boolean) {
        for (const field in this.data.formFields) this.data.formFields[field].editMode = state;
    }

    applyChanges(item, form, formField) {
        if (form.dirty) {
            item[formField] = form.value[formField];
            if (form.valid) this.setEditModeForAll(false);
            this.update(form, formField);
        } else {
            this.setEditModeForAll(false);
        }
    }

}
