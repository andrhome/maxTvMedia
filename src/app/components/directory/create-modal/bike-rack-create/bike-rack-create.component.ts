import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractCreateModalComponent} from '../abstract-create-modal';

declare const toastr: any;

@Component({
    selector: 'bike-rack-create',
    templateUrl: './bike-rack-create.component.html'
})
export class BikeRackCreateComponent extends AbstractCreateModalComponent implements OnInit {
    title = 'Bike Rack';

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            toastr.warning('Send data not valid.');
            if (!form.value.building)   toastr.warning('Building should not be blank.');
            if (!form.value.suite)      toastr.warning('Unit should not be blank.');
            if (!form.value.rackNumber) toastr.warning('Bike rack number should not be blank.');
            return;
        }
        const data: any = {
            building:   form.value.building,
            suite:      form.value.suite,
            rackNumber: form.value.rackNumber,
            rentedOut:  form.value.rentedOut,
            rentedTo:   form.value.rentedTo,
            note:       form.value.note
        };

        this.directoryService.currentTabId = 'bike-racks';
        this.create(data);
    }

}
