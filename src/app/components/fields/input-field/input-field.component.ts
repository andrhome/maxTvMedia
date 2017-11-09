import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {AbstractFieldClass} from '../abstract-field.class';

@Component({
    selector: 'input-field',
    templateUrl: 'input-field.template.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputFieldComponent), multi: true }
    ]
})
export class InputFieldComponent extends AbstractFieldClass {
    @Input() tooltipText = '';
    @Input() title = '';
    @Input('class') valueClass = '';
    @Input() icon = '';

    constructor() {
        super();
    }

    public validator(value): boolean {
        return true;
    }

}
