import {Component, Host, OnInit} from '@angular/core';
import {ApiResidentService} from '../../../services/api-directory.service';
import {DirectoryItemComponent} from '../directory-item.component';
import {AbstractView} from '../abstract-view.class';
import {PhoneTransformer} from '../../../services/transformer.service';

declare const swal: any;

@Component({
    templateUrl: 'residents.template.html',
    providers: [ApiResidentService]
})
export class ResidentsComponent extends AbstractView implements OnInit {
    title = 'Resident';

    constructor(@Host() parent: DirectoryItemComponent,
                public api: ApiResidentService) {
        super(parent, api);
    }

    ngOnInit() {
        this.parent.directoryService.getGroups();
        super.ngOnInit();
    }

    getPrimaryPhone(data: Array<any>): string | boolean {
        if (data && data.length) {
            const primaryPhone = data.find(item => item.isPrimaryPhone);

            if (primaryPhone) {
                return PhoneTransformer.stringToPhone(primaryPhone.phone);
            }
        }

        return false;
    }

    resetPhones(phones) {
        this.data.phones = phones;
    }

    resetAddress(addresses) {
        this.data.addresses = addresses;
    }

    remove(): void {
        swal({
                title: 'Move Out Resident',
                text: 'Are you sure you want to move out resident?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: true
            }, () => {
                this.api.deleteItem(this.id).subscribe(() => {
                    this.updateView();
                });
            }
        );

    }

}
