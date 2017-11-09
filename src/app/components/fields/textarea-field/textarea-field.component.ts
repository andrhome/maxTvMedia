import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {AbstractFieldClass} from '../abstract-field.class';

@Component({
    selector: 'textarea-field',
    templateUrl: 'textarea-field.template.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => TextareaFieldComponent), multi: true }
    ]
})

export class TextareaFieldComponent extends AbstractFieldClass {
    @Input() tooltipText = '';
    @Input() title = '';
    @Input('class') valueClass = '';
    @Input() iconClass = '';

    constructor() {
        super();
    }

    public validator(value): boolean {
        return true;
    }

}
