import {Component, OnInit} from '@angular/core';
import {DirectoryService} from '../../../../services/directory.service';
import {ParkingSpot} from '../../../../types/data.types';
import {UrlService} from '../../../../services/url.service';
import {AbstractListComponent} from '../abstract-list.component';
import {EmptyRowService} from '../../../../services/empty-row.service';

@Component({
    selector: 'parking-spots-list',
    templateUrl: './parking-spots-list.component.html'
})
export class ParkingSpotsListComponent extends AbstractListComponent implements OnInit {

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
            if (response.id !== 'parking-spots') return;
            this.data = [];
            const entities = response.data.entities || [];
            entities.forEach((data) => {
                const parking = new ParkingSpot();
                if (data.id)               parking.id               = data.id;
                if (data.parkingNumber)    parking.parkingNumber    = data.parkingNumber;
                if (data.legalDescription) parking.legalDescription = data.legalDescription;
                if (data.rentedOut )       parking.rentedOut        = data.rentedOut ? 1 : 0;
                if (data.rentedTo)         parking.rentedTo         = data.rentedTo;
                if (data.garageRemote)     parking.garageRemote     = data.garageRemote;
                if (data.handicap)         parking.handicap         = data.handicap;
                if (data.note)             parking.note             = data.note;

                if (data.suite)            parking.suiteId          = data.suite.id;
                if (data.suite)            parking.suiteNumber      = data.suite.suiteNumber;
                if (data.building)         parking.buildingId       = data.building.id;
                if (data.building)         parking.buildingName     = data.building.name;

                const selItem = this.directoryService.selectedItemData;
                if(selItem && selItem.id == data.id) {
                    parking.checked = true;
                    this.directoryService.toggleDetailedView(parking, true);
                }

                this.data.push(parking);
            });
            this.fillEmptyRow();
        }));
    }

}
