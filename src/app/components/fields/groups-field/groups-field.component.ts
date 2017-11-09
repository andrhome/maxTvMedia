import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR, NG_VALIDATORS} from '@angular/forms';
import {AbstractFieldClass} from '../abstract-field.class';
import {DirectoryService} from '../../../services/directory.service';

@Component({
    selector: 'groups-field',
    templateUrl: 'groups-field.template.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GroupsFieldComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => GroupsFieldComponent), multi: true }
    ]
})
export class GroupsFieldComponent extends AbstractFieldClass {
    @Input('value') _value: any = [];
    multiselectSettings = {
        singleSelection: false,
        text: 'Select Groups',
        selectAllText: 'Select All',
        unSelectAllText: 'Deselect All',
    };

    constructor(public directoryService: DirectoryService) {
        super();
    }

    validator(value: any): boolean {
        return true;
    }

}

