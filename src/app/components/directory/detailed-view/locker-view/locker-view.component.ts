import {Component, OnInit} from '@angular/core';
import {Locker} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractDetailedView} from '../abstract-detailed-view';

@Component({
    selector: 'locker-view',
    templateUrl: './locker-view.component.html'
})
export class LockerViewComponent extends AbstractDetailedView implements OnInit {
    title = 'Locker';
    data: Locker;

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

}



