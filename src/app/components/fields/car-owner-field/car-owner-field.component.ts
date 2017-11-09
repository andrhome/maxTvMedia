import {Component, Input, forwardRef, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {AbstractFieldClass} from '../abstract-field.class';
import {ApiVehiclesService} from '../../../services/api-directory.service';

@Component({
    selector: 'car-owner-field',
    templateUrl: 'car-owner-field.template.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CarOwnerFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => CarOwnerFieldComponent), multi: true },
        ApiVehiclesService
    ]
})
export class CarOwnerFieldComponent extends AbstractFieldClass implements OnInit {
    @Input('ownerName') _ownerName: string;
    @Input() title = '';
    @Input() tooltipText = '';
    @Input() optionTitleKey = 'name';
    @Input('class') valueClass = '';
    @Input() iconClass = '';
    @Input() suiteId: number;

    ownersList: Array<any>;

    constructor(private api: ApiVehiclesService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.value = this.value ? this.value : 0;
        this.ownerName = this.ownerName || '';
        this.getOwners();
    }

    get ownerName() {
        return this._ownerName;
    }

    set ownerName(val) {
        this._ownerName = val || '';
        this.propagateChange(val);
    }

    public validator(value): boolean {
        return true;
    }

    private getValueById(id: any): any {
        if (id === null) return false;

        if (+id === 0) {
            return this.ownerName;
        } else {
            let selectedItem;

            if (this.ownersList && this.ownersList.length) {
                selectedItem = this.ownersList.find((elem) => +elem.id === +id);
            }

            return (selectedItem) ? selectedItem[this.optionTitleKey] : false;
        }
    }

    private getOwners() {
        this.api.getOwners(this.suiteId).subscribe((res) => {
            this.ownersList = res.entities;
        });
    }

}

