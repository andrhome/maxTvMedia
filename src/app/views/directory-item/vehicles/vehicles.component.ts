import {Component, Host} from '@angular/core';
import {ApiVehiclesService} from '../../../services/api-directory.service';
import {DirectoryItemComponent} from '../directory-item.component';
import {AbstractView} from '../abstract-view.class';

@Component({
    templateUrl: 'vehicles.template.html',
    providers: [ApiVehiclesService]
})

export class VehiclesComponent extends AbstractView {
    title = 'Vehicle';

    constructor(@Host() parent: DirectoryItemComponent,
                public api: ApiVehiclesService) {
        super(parent, api);
    }

    updateCarOwner(form) {
        if ( typeof form.value.owner  === 'number' )
             this.update({owner:     form.value.owner});
        else this.update({ownerName: form.value.owner});
    }

}
