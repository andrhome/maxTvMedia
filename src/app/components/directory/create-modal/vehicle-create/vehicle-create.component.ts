import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {ResidentForSelect, Vehicle} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractCreateModalComponent} from '../abstract-create-modal';

declare const toastr: any;

@Component({
    selector: 'vehicle-create',
    templateUrl: './vehicle-create.component.html'
})
export class VehicleCreateComponent extends AbstractCreateModalComponent implements OnInit {
    title = 'Vehicle';
    residents: Array<ResidentForSelect> = [];

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.suiteId) this.getResidentsBySuiteId(+this.suiteId);
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            toastr.warning('Send data not valid.');
            if (!form.value.building)     toastr.warning('Building should not be blank.');
            if (!form.value.suite)        toastr.warning('Unit should not be blank.');
            if (!form.value.licensePlate) toastr.warning('License plate should not be blank.');
            return;
        }
        const data: any = {
            building:     form.value.building,
            suite:        form.value.suite,
            licensePlate: form.value.licensePlate,
            year:         form.value.year,
            color:        form.value.color,
            brand:        form.value.brand,
            model:        form.value.model,
            note:         form.value.note,
        };

        if (form.value.ownerId == 0) {
            data['ownerName'] = form.value.customOwnerName;
        } else {
            data['owner'] = form.value.ownerId;
        }

        this.directoryService.currentTabId = 'vehicles';
        this.create(data);
    }

    getResidentsBySuiteId(id: number) {
        this.residents = [];
        if (!id) return;
        const url = `/v1/residents.json?suite_id=${id}&per-page=10000&expand=suiteUser&order-by=fullName|asc`;
        this.api.get('domainBD', url).subscribe(
            (res) => {
                const entities = JSON.parse(res._body).entities || [];
                entities.forEach((item) => {
                    const fullName = item.fullName.slice(0, 50);
                    const resident = new ResidentForSelect(item.id, fullName, item.suiteUser);
                    this.residents.push(resident);
                });
                this.residents.push(new ResidentForSelect(0, 'Other'));
            },
            (error) => this.api.errorHandler(error, 'Failed get suites')
        );
    }

    changeBuilding(id) {
        this.getSuitesByBuildingId(id);
        this.residents = [];
    }

}
