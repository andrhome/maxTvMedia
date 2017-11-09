import {Component} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {Unit} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractCreateModalComponent} from '../abstract-create-modal';

declare const toastr: any;

@Component({
    selector: 'unit-create',
    templateUrl: './unit-create.component.html'
})

export class UnitCreateComponent extends AbstractCreateModalComponent {
    title = 'Unit';
    occupancyDate: Date;

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

    onSubmit(form: NgForm) {
        this.checkFormValidity();
        if (form.invalid) {
            toastr.warning('Send data not valid.');
            if (!form.value.building)    toastr.warning('Building should not be blank.');
            if (!form.value.suiteNumber) toastr.warning('Unit Number should not be blank.');
            return;
        }
        const data = {
            building:           form.value.building,
            suiteNumber:        form.value.suiteNumber,
            buzz:               form.value.buzz,
            proportionateShare: form.value.proportionateShare,
            emergencyContact:   form.value.emergencyContact,
            legalDescription:   form.value.legalDescription,
            keyFob:             form.value.keyFob,
            keyCode:            form.value.keyCode,
            powerAttorney:      form.value.powerAttorney,
            allowedVisitor:     form.value.allowedVisitor,
            note:               form.value.note,
            rentedOut:          form.value.rentedOut,
            occupancyDate:      form.value.occupancyDate,
        };
        this.create(data);
    }

    checkFormValidity(): void {
        this.disabledSubmit = this.form.invalid;
    }

}
