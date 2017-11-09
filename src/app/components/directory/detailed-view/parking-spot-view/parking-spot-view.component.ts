import {Component, OnInit} from '@angular/core';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractDetailedView} from '../abstract-detailed-view';
import {ParkingSpot} from '../../../../types/data.types';

@Component({
    selector: 'parking-spot-view',
    templateUrl: './parking-spot-view.component.html'
})
export class ParkingSpotViewComponent extends AbstractDetailedView implements OnInit {
    title = 'Parking Spot';
    data: ParkingSpot;

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

}
