import {Component, Host} from '@angular/core';
import {ApiLockersService} from '../../../services/api-directory.service';
import {DirectoryItemComponent} from '../directory-item.component';
import {AbstractView} from '../abstract-view.class';

@Component({
    templateUrl: 'lockers.template.html',
    providers: [ApiLockersService]
})
export class LockersComponent extends AbstractView {
    title = 'Locker';

    constructor(@Host() parent: DirectoryItemComponent,
                public api: ApiLockersService) {
        super(parent, api);
    }

    resetRentedTo() {
        if (+this.data.rentedOut === 0) this.data.rentedTo = '';
    }

}

