import {Component, Host} from '@angular/core';
import {ApiParkingSpotsService} from '../../../services/api-directory.service';
import {DirectoryItemComponent} from '../directory-item.component';
import {AbstractView} from '../abstract-view.class';

@Component({
    templateUrl: 'parking-spots.template.html',
    providers: [ApiParkingSpotsService]
})
export class ParkingSpotsComponent extends AbstractView {
    title = 'Parking Spot';

    constructor(@Host() parent: DirectoryItemComponent,
                public api: ApiParkingSpotsService) {
        super(parent, api);
    }

    resetRentedTo() {
        if (+this.data.rentedOut === 0) this.data.rentedTo = '';
    }

}
