import {Component, OnInit, OnDestroy} from '@angular/core';
import {DirectoryService} from '../../../../services/directory.service';
import {Unit} from '../../../../types/data.types';
import {UrlService} from '../../../../services/url.service';
import {AbstractListComponent} from '../abstract-list.component';
import {EmptyRowService} from '../../../../services/empty-row.service';

@Component({
    selector: 'units-list',
    templateUrl: './units-list.component.html'
})

export class UnitsListComponent extends AbstractListComponent implements OnInit, OnDestroy {

    constructor(
        public directoryService: DirectoryService,
        public urlService: UrlService,
        public emptyRowService: EmptyRowService
    ) {
        super(directoryService, urlService, emptyRowService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.s.push(
            this.directoryService.onDataReceived.subscribe((response) => {
                if (response.id !== 'units') return;
                this.data = [];
                const entities = response.data.entities;
                entities.forEach((data) => {
                    const unit = new Unit();
                    if (data.id)                 unit.id                  = data.id;
                    if (data.building)           unit.buildingId          = data.building.id;
                    if (data.building)           unit.buildingName        = data.building.name;
                    if (data.suiteNumber)        unit.suiteNumber         = data.suiteNumber;
                    if (data.buzz)               unit.buzz                = data.buzz;
                    if (data.proportionateShare) unit.proportionateShare  = data.proportionateShare;
                    if (data.emergencyContact)   unit.emergencyContact    = data.emergencyContact;
                    if (data.legalDescription)   unit.legalDescription    = data.legalDescription;
                    if (data.enterPhone)         unit.enterPhone          = data.enterPhone;
                    if (data.keyFob)             unit.keyFob              = data.keyFob;
                    if (data.keyCode)            unit.keyCode             = data.keyCode;
                    if (data.powerAttorney)      unit.powerAttorney       = data.powerAttorney;
                    if (data.allowedVisitor)     unit.allowedVisitor      = data.allowedVisitor;
                    if (data.note)               unit.note                = data.note;
                    if (data.rentedOut)          unit.rentedOut           = data.rentedOut ? 1 : 0;
                    if (data.fromFiveReceived)   unit.fromFiveReceived    = data.fromFiveReceived;
                    if (data.occupancyDate)      unit.occupancyDate       = data.occupancyDate;
                    if (data.suiteUser)          unit.suiteUser           = data.suiteUser;
                    if (data.parking)            unit.parking             = data.parking;
                    if (data.locker)             unit.locker              = data.locker;
                    if (data.bikeRack)           unit.bikeRack            = data.bikeRack;
                    if (data.pet)                unit.pet                 = data.pet;

                    const selItem = this.directoryService.selectedItemData;
                    if(selItem && selItem.id == data.id) {
                        unit.checked = true;
                        this.directoryService.toggleDetailedView(unit, true);
                    }

                    this.data.push(unit);
                });
                this.fillEmptyRow();
            })
        );
    }

}
