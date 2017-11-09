import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms/forms';
import {ResidentForSelect, Vehicle} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractDetailedView} from '../abstract-detailed-view';

declare const toastr: any;

@Component({
    selector: 'vehicle-view',
    templateUrl: './vehicle-view.component.html'
})
export class VehicleViewComponent extends AbstractDetailedView implements OnInit {
    title = 'Vehicle';
    residents: Array<ResidentForSelect> = [];

    constructor(public directoryService: DirectoryService,
                public api: ApiClientService) {
        super(directoryService, api);
    }

    initData(data) {
        if (!data) return;
        this.data = data;
        this.setEditModeForAll(false);
        this.getResidentsBySuiteId(+this.data.suiteId);
    }

    update(form: NgForm, formField) {
        if (!form.valid) {
            toastr.warning('Send data not valid.');
            if (!form.value.licensePlate) toastr.warning('License plate should not be blank.');
            return;
        }
        const data: any = {};

        if (formField === 'customOwnerName' ) data['ownerName'] = form.value.customOwnerName;
        else if (formField === 'ownerId' )    data['owner'] = form.value.ownerId;
        else                                  data[formField] = form.value[formField];


        this.patch(form.value.id, data);

        if (form.value.ownerId == 0) {
            this.data.ownerId = null;
            this.data.ownerName = data.ownerName;
        }
    }

    getResidentsBySuiteId(id: number) {
        this.residents = [];
        if (!id) {
            this.residents.push(new ResidentForSelect(0, 'Other'));
            return;
        }

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

    getResidentFullNameById(id: number): string {
        const resident = this.residents.find((r) => r.id == id);
        return resident ? resident.fullName : '';
    }
}



