import {Component, OnDestroy, OnInit} from '@angular/core';
import {Unit} from '../../../../types/data.types';
import {DirectoryService} from '../../../../services/directory.service';
import {ApiClientService} from '../../../../services/api-client.service';
import {AbstractDetailedView} from '../abstract-detailed-view';

@Component({
    selector: 'unit-view',
    templateUrl: './unit-view.component.html'
})

export class UnitViewComponent extends AbstractDetailedView implements OnInit, OnDestroy {
    title = 'Unit';

    constructor(
        public directoryService: DirectoryService,
        public api: ApiClientService
    ) {
        super(directoryService, api);
    }

}
