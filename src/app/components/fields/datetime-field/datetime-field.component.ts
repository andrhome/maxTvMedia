import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {AbstractFieldClass} from '../abstract-field.class';

@Component({
    selector: 'datetime-field',
    templateUrl: 'datetime-field.template.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatetimeFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DatetimeFieldComponent), multi: true }
    ]
})
export class DatetimeFieldComponent extends AbstractFieldClass {
    @Input() title             = '';
    @Input() classLabel        = 'dv-label col-sm-4 strong';
    @Input() classValueBox     = 'dv-value col-sm-8';
    @Input() classValueEditBox = 'dv-value-edit col-sm-8';

    constructor() {
        super();
    }

    validator(value: any): boolean {
        return true;
    }

    public editModeOn(): void {
        super.editModeOn();
    }

}

