import {Component, OnInit} from '@angular/core';
import {DirectoryService} from '../../../../services/directory.service';
import {Pet} from '../../../../types/data.types';
import {UrlService} from '../../../../services/url.service';
import {AbstractListComponent} from '../abstract-list.component';
import {EmptyRowService} from '../../../../services/empty-row.service';

@Component({
    selector: 'pets-list',
    templateUrl: './pets-list.component.html'
})
export class PetsListComponent extends AbstractListComponent implements OnInit {

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
            if (response.id !== 'pets') return;
            this.data = [];
            const entities = response.data.entities || [];
            entities.forEach((data) => {
                const pet = new Pet();
                if (data.id)          pet.id            = data.id;
                if (data.name)        pet.name          = data.name;
                if (data.petType)     pet.petTypeId     = data.petType.id;
                if (data.petType)     pet.petTypeName   = data.petType.name;
                if (data.weight)      pet.weight        = data.weight;
                if (data.height)      pet.height        = data.height;
                if (data.dateOfBirth) pet.dateOfBirth   = data.dateOfBirth;
                if (data.breed)       pet.breed         = data.breed;
                if (data.note)        pet.note          = data.note;

                if (data.suite)       pet.suiteId       = data.suite.id;
                if (data.suite)       pet.suiteNumber   = data.suite.suiteNumber;
                if (data.building)    pet.buildingId    = data.building.id;
                if (data.building)    pet.buildingName  = data.building.name;

                const selItem = this.directoryService.selectedItemData;
                if(selItem && selItem.id == data.id) {
                    pet.checked = true;
                    this.directoryService.toggleDetailedView(pet, true);
                }

                this.data.push(pet);
            });
            this.fillEmptyRow();
        }));
    }

}
