import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {Pet} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractCreateModalComponent} from '../abstract-create-modal';

declare const toastr: any;

@Component({
    selector: 'pet-create',
    templateUrl: './pet-create.component.html'
})
export class PetCreateComponent extends AbstractCreateModalComponent implements OnInit {
    title = 'Pet';
    dateOfBirth: Date;

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

    ngOnInit() {
        super.ngOnInit();
        this.directoryService.getPetTypes();
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            toastr.warning('Send data not valid.');
            if (!form.value.building) toastr.warning('Building should not be blank.');
            if (!form.value.suite)    toastr.warning('Unit should not be blank.');
            return;
        }
        const data: any = {
            building:    form.value.building,
            suite:       form.value.suite,
            name:        form.value.name,
            petType:     form.value.petTypeId,
            weight:      form.value.weight,
            height:      form.value.height,
            dateOfBirth: form.value.dateOfBirth,
            breed:       form.value.breed,
            note:        form.value.note,
        };

        this.directoryService.currentTabId = 'pets';
        this.create(data);
    }

}
