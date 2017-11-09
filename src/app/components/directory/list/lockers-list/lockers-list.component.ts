import {Component, OnInit} from '@angular/core';
import {DirectoryService} from '../../../../services/directory.service';
import {Locker} from '../../../../types/data.types';
import {UrlService} from '../../../../services/url.service';
import {AbstractListComponent} from '../abstract-list.component';
import {EmptyRowService} from '../../../../services/empty-row.service';

@Component({
    selector: 'lockers-list',
    templateUrl: './lockers-list.component.html'
})
export class LockersListComponent extends AbstractListComponent implements OnInit {

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
            if (response.id !== 'lockers') return;
            this.data = [];
            const entities = response.data.entities;
            entities.forEach((data) => {
                const locker = new Locker();
                if (data.id)               locker.id                = data.id;
                if (data.lockerKeyCode)    locker.lockerKeyCode     = data.lockerKeyCode;
                if (data.legalDescription) locker.legalDescription  = data.legalDescription;
                if (data.rentedOut)        locker.rentedOut         = data.rentedOut ? 1 : 0;
                if (data.rentedTo)         locker.rentedTo          = data.rentedTo;
                if (data.note)             locker.note              = data.note;

                if (data.suite)            locker.suiteId           = data.suite.id;
                if (data.suite)            locker.suiteNumber       = data.suite.suiteNumber;
                if (data.building)         locker.buildingId        = data.building.id;
                if (data.building)         locker.buildingName      = data.building.name;

                const selItem = this.directoryService.selectedItemData;
                if (selItem && selItem.id == data.id) {
                    locker.checked = true;
                    this.directoryService.toggleDetailedView(locker, true);
                }

                this.data.push(locker);
            });
            this.fillEmptyRow();
        }));
    }

}
