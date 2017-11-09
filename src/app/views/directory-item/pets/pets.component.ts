import {Component, Host} from '@angular/core';
import {AbstractView} from '../abstract-view.class';
import {DirectoryItemComponent} from '../directory-item.component';
import {ApiPetsItemService} from '../../../services/api-directory.service';

@Component({
    templateUrl: 'pets.template.html',
    providers: [ApiPetsItemService]
})
export class PetsComponent extends AbstractView {
    title = 'Pet';
    protected petsList: Array<any>;

    constructor(@Host() parent: DirectoryItemComponent,
                public api: ApiPetsItemService) {
        super(parent, api);

        this.getPetTypes();
    }

    private getPetTypes() {
        this.api.getPetTypes().subscribe((res) => {
            this.petsList = res.entities;
        });
    }

}
