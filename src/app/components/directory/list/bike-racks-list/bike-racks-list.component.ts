import {Component, OnInit} from '@angular/core';
import {BikeRack} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {UrlService} from '../../../../services/url.service';
import {AbstractListComponent} from '../abstract-list.component';
import {EmptyRowService} from '../../../../services/empty-row.service';

@Component({
    selector: 'bike-racks-list',
    templateUrl: './bike-racks-list.component.html'
})
export class BikeRacksListComponent extends AbstractListComponent implements OnInit {

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
            if (response.id !== 'bike-racks') return;
            this.data = [];
            const entities = response.data.entities || [];
            entities.forEach((data) => {
                const bikeRack = new BikeRack();
                if (data.id        ) bikeRack.id         = data.id;
                if (data.rackNumber) bikeRack.rackNumber = data.rackNumber;
                if (data.rentedOut ) bikeRack.rentedOut  = data.rentedOut ? 1 : 0;
                if (data.rentedTo  ) bikeRack.rentedTo   = data.rentedTo;
                if (data.note      ) bikeRack.note       = data.note;

                if (data.suite)      bikeRack.suiteId           = data.suite.id;
                if (data.suite)      bikeRack.suiteNumber       = data.suite.suiteNumber;
                if (data.building)   bikeRack.buildingId        = data.building.id;
                if (data.building)   bikeRack.buildingName      = data.building.name;

                const selItem = this.directoryService.selectedItemData;
                if(selItem && selItem.id == data.id) {
                    bikeRack.checked = true;
                    this.directoryService.toggleDetailedView(bikeRack, true);
                }

                this.data.push(bikeRack);
            });
            this.fillEmptyRow();
        }));
    }

}
