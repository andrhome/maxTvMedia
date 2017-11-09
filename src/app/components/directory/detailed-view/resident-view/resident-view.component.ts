import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {Resident} from '../../../../types/data.types';
import {AbstractDetailedView} from '../abstract-detailed-view';
import {ApiResidentService} from '../../../../services/api-directory.service';
import {PhoneTransformer} from '../../../../services/transformer.service';
import {ConstantsService} from '../../../../services/constants.service';

declare const $: any;
declare const toastr: any;
declare const swal: any;

@Component({
    selector: 'resident-view',
    templateUrl: './resident-view.component.html',
    providers: [ApiResidentService]
})

export class ResidentViewComponent extends AbstractDetailedView implements OnInit, OnDestroy {
    title = 'Resident';
    primaryPhoneVal;
    residentGroupsCopy;
    multiselectSettings = {
        singleSelection: false,
        text: 'Select Groups',
        selectAllText: 'Select All',
        unSelectAllText: 'Deselect All',
    };

    constructor(public directoryService: DirectoryService,
                public api: ApiClientService,
                public apiResident: ApiResidentService) {
        super(directoryService, api);
    }

    ngOnInit() {
        this.directoryService.getGroups();
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.s.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    initData(data: Resident) {
        if (!data) return;

        this.data = null;
        setTimeout(() => {
            this.data = data;
            this.primaryPhoneVal = this.data.phones.find((item) => item.isPrimaryPhone === true);
            this.residentGroupsCopy = this.data.groups.slice();
        });

    }

    onSubmit(data: any): void {
        this.apiResident.updateItem(this.data.suiteUserId, data).subscribe(
            () => this.updateView(null, false),
            (error) => { toastr.error('Update failed!'); }
        );
    }

    private getPrimaryPhone(data: Array<any>): string | boolean {
        if (data && data.length) {
            const primaryPhone = data.find(item => item.isPrimaryPhone);

            if (primaryPhone) {
                return PhoneTransformer.stringToPhone(primaryPhone.phone);
            }
        }

        return false;
    }

    applyChanges(item, form, formField) {
        if (formField !== 'phones' && formField !== 'addresses' && formField !== 'email') {
            if (form.dirty) {
                item[formField] = form.value[formField];
            } else {
                this.setEditModeForAll(false);
            }
        }
        if (form.valid) this.setEditModeForAll(false);
    }

    updatePhones(phones) {
        this.data.phones = phones;

        this.applyChanges(this.data, this.form, 'phones');
    }

    updateAddress(addresses) {
        this.data.addresses = addresses;

        this.data.phones = this.data.phones.filter((item) => {
            return item.phone && item.user;
        });

        this.applyChanges(this.data, this.form, 'addresses');
    }

    resetPhones(phones) {
        this.data.phones = phones;
    }

    remove(id: number): void {
        swal(ConstantsService.getSwalConfig('Move Out Resident', 'Are you sure you want to move out resident?'),
            () => {
                const url = this.directoryService.getUrl('remove');
                this.api.remove('domainBD', url + id).subscribe(
                    ()      => this.updateView('Resident has been moved out.'),
                    (error) => this.api.errorHandler(error, 'Resident move out failed.')
                );
            }
        );
    }

}
