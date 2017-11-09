import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';

import {AbstractFieldClass} from '../abstract-field.class';

@Component({
    selector: 'boolean-field',
    templateUrl: 'boolean-field.template.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BooleanFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => BooleanFieldComponent), multi: true }
    ]
})
export class BooleanFieldComponent extends AbstractFieldClass {
    @Input('value') _value: any = 0;
    @Input() title = '';
    @Input() valueTitle = '';
    @Input() tooltipText = '';
    @Input('class') valueClass = '';
    @Input() iconClass = '';

    constructor() {
        super();
    }

    public validator(value): boolean {
        return true;
    }
}

