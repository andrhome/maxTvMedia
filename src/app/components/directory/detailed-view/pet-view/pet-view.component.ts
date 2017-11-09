import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {Pet} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractDetailedView} from '../abstract-detailed-view';

declare const toastr: any;

@Component({
    selector: 'pet-view',
    templateUrl: './pet-view.component.html'
})
export class PetViewComponent extends AbstractDetailedView implements OnInit {
    data: Pet;
    title = 'Pet';

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

    update(form: NgForm, formField) {
        if (!form.valid) {
            toastr.warning('Send data not valid.');
            return;
        }
        const data: any = {};

        if (formField === 'petTypeId' ) data['petType'] = form.value.petTypeId;
        else                            data[formField] = form.value[formField];

        this.patch(form.value.id, data);
    }

}
