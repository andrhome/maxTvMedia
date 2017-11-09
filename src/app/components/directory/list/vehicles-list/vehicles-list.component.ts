import {Component, OnInit} from '@angular/core';
import {Vehicle} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {UrlService} from '../../../../services/url.service';
import {AbstractListComponent} from '../abstract-list.component';
import {EmptyRowService} from '../../../../services/empty-row.service';

@Component({
    selector: 'vehicles-list',
    templateUrl: './vehicles-list.component.html'
})
export class VehiclesListComponent extends AbstractListComponent implements OnInit {

    constructor(
        public directoryService: DirectoryService,
        public urlService: UrlService,
        public emptyRowService: EmptyRowService
    ) {
        super(directoryService, urlService, emptyRowService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.s.push(this.directoryService.onDataReceived.subscribe((response) => {
            if (response.id !== 'vehicles') return;
            this.data = [];
            const entities = response.data.entities || [];
            entities.forEach((data) => {
                if (!data.building) {
                    return;
                }
                const vehicle = new Vehicle();
                if (data.id) vehicle.id = data.id;
                if (data.licensePlate) vehicle.licensePlate = data.licensePlate;
                if (data.year) vehicle.year = data.year;
                if (data.color) vehicle.color = data.color;
                if (data.note) vehicle.note = data.note;
                if (data.brand) vehicle.brand = data.brand;
                if (data.model) vehicle.model = data.model;

                if (data.owner) {
                    vehicle.ownerId = data.owner.id;
                    vehicle.ownerName = data.owner.name;
                }

                if (data.ownerName) {
                    vehicle.ownerName = data.ownerName;
                }

                if (data.suite) vehicle.suiteId = data.suite.id;
                if (data.suite) vehicle.suiteNumber = data.suite.suiteNumber;
                if (data.building) vehicle.buildingId = data.building.id;
                if (data.building) vehicle.buildingName = data.building.name;

                const selItem = this.directoryService.selectedItemData;
                if (selItem && selItem.id == data.id) {
                    vehicle.checked = true;
                    this.directoryService.toggleDetailedView(vehicle, true);
                }

                this.data.push(vehicle);
            });
            this.fillEmptyRow();
        }));
    }

}
