import {Component, Input, Output, forwardRef, EventEmitter, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';

import {AbstractFieldClass} from '../abstract-field.class';

import {UserPhoneType} from '../../../types/data.types';
import {DirectoryService} from '../../../services/directory.service';
import {PhoneTransformer} from '../../../services/transformer.service';
import {ConstantsService} from '../../../services/constants.service';

declare const swal: any;

@Component({
    selector: 'phone-field',
    templateUrl: './phone-field.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => PhoneFieldComponent), multi: true }
    ]
})
export class PhoneFieldComponent extends AbstractFieldClass implements OnInit {
    @Input() userId: number;
    @Output('reset') resetPhones: EventEmitter<any> = new EventEmitter<any>();

    private primaryPhoneIndex: number;
    private originPrimaryPhoneIndex: number;

    private phoneTypes: Array<any> = [
        {type: 'phone_home', label: 'Home'},
        {type: 'phone_cell', label: 'Cell'},
        {type: 'phone_business', label: 'Business'},
        {type: 'phone_fax', label: 'Fax'},
        {type: 'phone_business_fax', label: 'Business Fax'},
        {type: 'phone_other', label: 'Other'},
    ];

    constructor(public directoryService: DirectoryService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getCurrentPrimaryState();
    }

    private getPhoneTypeLabel(type): string {
        const typeObj = this.phoneTypes.find((i) => i.type === type);
        return typeObj ? typeObj.label : '';
    }

    private addNew(): void {
        const isFirst = this.value.length === 0;
        this.value.push(new UserPhoneType(isFirst));
        this.value[this.value.length - 1].user = this.userId;

        if (isFirst) {
            this.getCurrentPrimaryState();
        }

        this.propagateChange(this.value);
        this.editModeOn();
    }

    private delete(index): void {
        swal(ConstantsService.getSwalConfig('Delete Phone'), () => {
            if (index === 0 && this.value[index].isPrimaryPhone && this.value[1]) {
                this.updatePrimary(1);
            }
            if (this.value[index].isPrimaryPhone) {
                this.updatePrimary(0);
            }
            this.value.splice(index, 1);
            this.propagateChange(this.value);
            this.apply();
        });
    }

    private updatePhone(value, index): void {
        this.value[index].phone = value;
        this.propagateChange(this.value);
    }

    private updateType(value, index): void {
        this.value[index].phoneType = value;
        this.propagateChange(this.value);
    }

    private updatePrimary(index): void {
        if (!this.value.length) return;
        this.resetPrimaryState();
        this.value[index].isPrimaryPhone = true;
        this.propagateChange(this.value);
    }

    private getPhone(data: any) {
        return PhoneTransformer.stringToPhone(data.phone);
    }

    private preparePhoneForInput(data: any) {
        return PhoneTransformer.phoneToString(data.phone);
    }

    private resetPrimaryState(): void {
        this.value.forEach((item) => {
            item.isPrimaryPhone = false;
        });
    }

    private getCurrentPrimaryState(): void {
        if (this.value.length === 1) {
            this.primaryPhoneIndex = 0;
            this.originPrimaryPhoneIndex = 0;
            this.updatePrimary(0);
            return;
        }
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].isPrimaryPhone) {
                this.primaryPhoneIndex = i;
                this.originPrimaryPhoneIndex = i;

                return;
            }
        }
    }

    public getPrimaryIndex() {
        for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].isPrimaryPhone) {
                return i;
            }
        }
    }

    apply(): void {
        this.prepareDataBeforeApply(this.value);

        super.apply();
        this.getCurrentPrimaryState();
    }

    copyValue(): void {
        super.copyValue();
    }

    reset(): void {
        super.reset();
        this.primaryPhoneIndex = this.originPrimaryPhoneIndex;

        this.propagateChange(this.value);

        this.resetPhones.emit(this.value);
    }

    validator(value: any): boolean {
        return undefined;
    }

    private prepareDataBeforeApply(data: Array<any>): void {
        this.value = this.value.filter((item) => {
            if (!item.phone) {
                if (item.isPrimaryPhone) {
                    this.value[0].isPrimaryPhone = true;
                }

                return false;
            }

            return true;
        });
    }

}

