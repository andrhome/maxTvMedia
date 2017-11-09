import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractCreateModalComponent} from '../abstract-create-modal';

declare const toastr: any;

@Component({
    selector: 'parking-spot-create',
    templateUrl: './parking-spot-create.component.html'
})
export class ParkingSpotCreateComponent extends AbstractCreateModalComponent implements OnInit {
    title = 'Parking Spot';

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
            if (!form.value.parkingNumber) toastr.warning('Parking Spot should not be blank.');
            return;
        }
        const data: any = {
            building:   form.value.building,
            suite:      form.value.suite,
            parkingNumber:    form.value.parkingNumber,
            legalDescription: form.value.legalDescription,
            rentedOut:        form.value.rentedOut,
            rentedTo:         form.value.rentedTo,
            garageRemote:     form.value.garageRemote,
            handicap:         form.value.handicap,
            note:             form.value.note,
        };

        this.directoryService.currentTabId = 'parking-spots';
        this.create(data);
    }


}



