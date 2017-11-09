import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {AbstractFieldClass} from '../abstract-field.class';

@Component({
    selector: 'role-field',
    templateUrl: 'role-field.template.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RoleFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => RoleFieldComponent), multi: true }
    ]
})
export class RoleFieldComponent extends AbstractFieldClass {
    @Input() title = '';
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

