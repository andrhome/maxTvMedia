import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {Resident, UserPhoneType, UserAddressType} from '../../../../types/data.types';
import {AbstractCreateModalComponent} from '../abstract-create-modal';
import {ConstantsService} from '../../../../services/constants.service';

declare const $: any;
declare const toastr: any;
declare const swal: any;

@Component({
    selector: 'resident-create',
    templateUrl: './resident-create.component.html',
})

export class ResidentCreateComponent extends AbstractCreateModalComponent implements OnInit {
    data = new Resident();
    title = 'Resident';
    multiselectSettings = {
        singleSelection: false,
        text: 'Select Groups',
        selectAllText: 'Select All',
        unSelectAllText: 'Deselect All',
    };
    phoneTypes = [
        {type: 'phone_home', label: 'Home'},
        {type: 'phone_cell', label: 'Cell'},
        {type: 'phone_business', label: 'Business'},
        {type: 'phone_fax', label: 'Fax'},
        {type: 'phone_business_fax', label: 'Business Fax'},
        {type: 'phone_other', label: 'Other'},
    ];

    dateOfBirth: Date;
    primaryPhone   = 'phone[0]';
    primaryAddress = 'address[0]';
    selectedGroup = [];

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);

        this.data.phones.push(new UserPhoneType());
        this.data.addresses.push(new UserAddressType());
    }

    ngOnInit() {
        super.ngOnInit();
        this.directoryService.getGroups();
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            toastr.warning('Send data not valid');
            if (!form.value.building) toastr.warning('Building should not be blank.');
            if (!form.value.suite)    toastr.warning('Unit should not be blank.');
            if (!form.value.fullName) toastr.warning('Resident Full Name should not be blank.');
            return;
        }
        const groups = form.value.groups.map( g => ({ group: +g.id}) );
        const data = {
            suite: form.value.suite,
            building: form.value.building,
            user: {
                email: form.value.email,
                fullName: form.value.fullName,
                dateOfBirth: this.dateOfBirth,
                addresses: this.getAddressesFromForm(form),
                phones: this.getPhonesFromForm(form),
                groups: groups,
                emergencyContact: form.value.emergencyContact,
                emergencyAssistantNotes: form.value.emergencyAssistantNotes,
                maxTvUser: 0,
                emailWaiverSigned: form.value.emailWaiverSigned,
                parcelWaiverSigned: form.value.parcelWaiverSigned,
                keyWaiverSigned: form.value.keyWaiverSigned,
            },
            role: form.value.role
        };

        this.directoryService.currentTabId = 'residents';
        this.create(data);
    }

    phoneInputFocusout(value: string, i: number): void {
        this.data.phones[i].phone = value;
        const phoneField = this.form.controls[`phone[${i}]`];
        if (phoneField) {
            phoneField.markAsDirty();
        }
    }

    getPhonesFromForm(form: NgForm): Array<UserPhoneType> {
        const phones: Array<UserPhoneType> = [];
        this.data.phones.forEach((phoneBlock, index) => {
            if (!form.value[`phone[${index}]`]) return;
            const phone = new UserPhoneType(
                (form.value[`isPrimaryPhone`] === `phone[${index}]`),
                form.value[`phone[${index}]`],
                form.value[`phone_type[${index}]`],
                this.data.id
            );
            phones.push(phone);
        });
        return phones;
    }

    getAddressesFromForm(form: NgForm): Array<UserAddressType> {
        const addresses: Array<UserAddressType> = [];
        this.data.addresses.forEach((addressBlocks, index) => {
            if (!form.value[`address[${index}]`]) return;
            const address = new UserAddressType(
                (form.value[`isPrimaryAddress`] === `address[${index}]`),
                form.value[`country[${index}]`],
                form.value[`state[${index}]`],
                form.value[`city[${index}]`],
                form.value[`address[${index}]`],
                form.value[`postalCode[${index}]`],
                this.data.id
            );
            addresses.push(address);
        });
        return addresses;
    }

    addNewPhone(): void {
        const isFirst = this.data.phones.length === 0;
        this.data.phones.push(new UserPhoneType(isFirst));
    }

    deletePhone(index): void {
        const phoneField = this.form.controls[`phone[${index}]`];

        if (phoneField && phoneField.value) {
            swal(ConstantsService.getSwalConfig('Delete Phone'),
                () => {
                    this.data.phones.splice(index, 1);
                    if (!this.data.phones.some(p => p.isPrimaryPhone)) {
                        this.primaryPhone = 'phone[0]';
                    }
                }
            );
        } else {
            this.data.phones.splice(index, 1);
        }

        if (this.data.phones.length === 0) {
            this.data.phones.push(new UserPhoneType());
        }
    }

    addNewAddress(): void {
        const isFirst = this.data.addresses.length === 0;
        this.data.addresses.push(new UserAddressType(isFirst));
    }

    deleteAddress(index): void {
        const addressField = this.form.controls[`address[${index}]`];

        if (addressField && addressField.value) {
            swal(ConstantsService.getSwalConfig('Delete Address'),
                () => {
                    this.data.addresses.splice(index, 1);
                    if (!this.data.addresses.some(p => p.isPrimaryAddress)) {
                        this.primaryAddress = 'address[0]';
                    }
                }
            );
        } else {
            this.data.addresses.splice(index, 1);
        }

        if (this.data.addresses.length === 0) {
            this.data.addresses.push(new UserAddressType());
        }
    }

}

