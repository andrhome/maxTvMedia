import {Component, OnInit} from '@angular/core';
import {BikeRack} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractDetailedView} from '../abstract-detailed-view';

@Component({
    selector: 'bike-rack-view',
    templateUrl: './bike-rack-view.component.html'
})
export class BikeRackViewComponent extends AbstractDetailedView implements OnInit {
    title = 'Bike Rack';
    data: BikeRack;

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

}



