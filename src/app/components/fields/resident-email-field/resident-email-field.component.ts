import {Component, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {ApiResidentService} from '../../../services/api-directory.service';
import {InputFieldComponent} from '../input-field/input-field.component';

declare const toastr: any;
declare const $: any;

@Component({
    selector: 'resident-email-field',
    templateUrl: 'resident-email-field.template.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ResidentEmailFieldComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => ResidentEmailFieldComponent), multi: true}
    ]
})
export class ResidentEmailFieldComponent extends InputFieldComponent {

    constructor(private api: ApiResidentService) {
        super();
    }

    public apply(field): void {
        if (!this.editOnly && $(field).hasClass('ng-valid')) {
            this.editModeOff();
            this.update.emit();
            this.copyValue();
        }
    }

    public validator(value): boolean {
        return true;
    }

}
