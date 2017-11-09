import {Component, Input, forwardRef, Output, EventEmitter, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';

import {AbstractFieldClass} from '../abstract-field.class';

import {UserAddressType} from '../../../types/data.types';
import {DirectoryService} from '../../../services/directory.service';
import {ConstantsService} from '../../../services/constants.service';

declare const swal: any;

@Component({
    selector: 'address-field',
    templateUrl: './address-field.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AddressFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AddressFieldComponent), multi: true }
    ]
})
export class AddressFieldComponent extends AbstractFieldClass implements OnInit {
    @Input() userId: number;
    @Output('reset') resetAddress: EventEmitter<any> = new EventEmitter<any>();

    private primaryIndex: number;
    private originPrimaryIndex: number;

    private isFormInvalid = false;

    constructor(private directoryService: DirectoryService) {
        super();

        this.directoryService.getCountries();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getCurrentPrimaryState();
    }

    private addNew(): void {
        const isFirst = this.value.length === 0;
        this.value.push(new UserAddressType(isFirst));
        this.value[this.value.length - 1].user = this.userId;

        if (isFirst) {
            this.getCurrentPrimaryState();
        }

        this.propagateChange(this.value);
        this.editModeOn();
    }

    private delete_(index): void {
        swal(ConstantsService.getSwalConfig('Delete Address'), () => {
            const isPrimaryAddress = this.value[index].isPrimaryAddress;
            this.value.splice(index, 1);
            this.copyValue();
            if (isPrimaryAddress && this.value.length) {
                this.value[0].isPrimaryAddress = true;
                this.primaryIndex = 0;
                this.checkedRadioInput();
            }
            this.propagateChange(this.value);
            this.update.emit(this.value);
        });
    }

    checkedRadioInput() {
        setTimeout(() => {
            const el = <HTMLInputElement>document.getElementById('primary-address-0');
            el.checked = true;
        }, 10);
    }

    private updatePrimary(index: number): void {
        this.resetPrimaryState(this.value);
        this.value[index].isPrimaryAddress = true;
        this.propagateChange(this.value);
    }

    private updateCountry(value, index): void {
        this.value[index].country = value;
        this.propagateChange(this.value);
    }

    private resetPrimaryState(data: Array<UserAddressType>): void {
        data.forEach((item) => {
            item.isPrimaryAddress = false;
        });
    }

    private getCurrentPrimaryState(): void {
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].isPrimaryAddress) {
                this.primaryIndex = i;
                this.originPrimaryIndex = i;

                return;
            }
        }
    }

    private getCountryNameById(id): string {
        for (let i = 0; i < this.directoryService.countries.length; i++) {
            if (this.directoryService.countries[i].id === id) {
                return this.directoryService.countries[i].countryName;
            }
        }

        return '';
    }

    apply(form): void {
        if (form.invalid) {
            this.isFormInvalid = true;

            return;
        } else {
            this.isFormInvalid = false;
        }
        super.apply();
        this.getCurrentPrimaryState();
    }

    reset(): void {
        super.reset();
        this.primaryIndex = this.originPrimaryIndex;

        this.propagateChange(this.value);

        this.resetAddress.emit(this.value);
    }

    validator(value: any): boolean {
        return true;
    }

}
