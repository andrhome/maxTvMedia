import {Component, Host} from '@angular/core';
import {DirectoryItemComponent} from '../directory-item.component';
import {AbstractView} from '../abstract-view.class';
import {ApiBikeRacksService} from '../../../services/api-directory.service';

@Component({
    templateUrl: 'bike-racks.template.html',
    providers: [ApiBikeRacksService]
})
export class BikeRacksComponent extends AbstractView {
    title = 'Bike Rack';

    constructor(@Host() parent: DirectoryItemComponent,
                public api: ApiBikeRacksService) {
        super(parent, api);
    }

    resetRentedTo() {
        if (+this.data.rentedOut === 0) this.data.rentedTo = '';
    }

}
