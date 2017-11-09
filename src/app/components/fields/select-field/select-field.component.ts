import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {AbstractFieldClass} from '../abstract-field.class';

@Component({
    selector: 'select-field',
    templateUrl: 'select-field.template.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => SelectFieldComponent), multi: true }
    ]
})
export class SelectFieldComponent extends AbstractFieldClass {
    @Input() title = '';
    @Input() tooltipText = '';
    @Input() optionTitleKey = 'name';
    @Input() data: Array<any> = [];
    @Input('class') valueClass = '';
    @Input() iconClass = '';
    @Input() withOther = false;
    @Input() other = '';


    private getValueById(id: any): any {
        if (id === null) return false;

        let selectedItem;

        if (this.data && this.data.length) {
            selectedItem = this.data.find((elem) => {

                return +elem.id === +id;
            });
        }

        return (selectedItem) ? selectedItem[this.optionTitleKey] : false;
    }

    constructor() {
        super();
    }

    public validator(value): boolean {
        return true;
    }

}

