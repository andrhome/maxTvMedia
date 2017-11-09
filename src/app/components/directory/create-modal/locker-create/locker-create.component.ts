import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {Locker} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractCreateModalComponent} from '../abstract-create-modal';

declare const toastr: any;

@Component({
    selector: 'locker-create',
    templateUrl: './locker-create.component.html'
})
export class LockerCreateComponent extends AbstractCreateModalComponent implements OnInit {
    title = 'Locker';

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            toastr.warning('Send data not valid.');
            if (!form.value.building)      toastr.warning('Building should not be blank.');
            if (!form.value.suite)         toastr.warning('Unit should not be blank.');
            if (!form.value.lockerKeyCode) toastr.warning('Locker number should not be blank.');
            return;
        }
        const data: any = {
            building:         form.value.building,
            suite:            form.value.suite,
            lockerKeyCode:    form.value.lockerKeyCode,
            legalDescription: form.value.legalDescription,
            rentedOut:        form.value.rentedOut,
            rentedTo:         form.value.rentedTo,
            note:             form.value.note,
        };

        this.directoryService.currentTabId = 'lockers';
        this.create(data);
    }

}



