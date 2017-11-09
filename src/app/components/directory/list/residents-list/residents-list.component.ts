import {Component, OnDestroy, OnInit} from '@angular/core';
import {DirectoryService} from '../../../../services/directory.service';
import {Resident, UserPhoneType, UserAddressType} from '../../../../types/data.types';
import {UrlService} from '../../../../services/url.service';
import {AbstractListComponent} from '../abstract-list.component';
import {PhoneTransformer} from '../../../../services/transformer.service';
import {EmptyRowService} from '../../../../services/empty-row.service';

@Component({
    selector: 'residents-list',
    templateUrl: './residents-list.component.html'
})
export class ResidentsListComponent extends AbstractListComponent implements OnInit, OnDestroy {

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
            if (response.id !== 'residents') return;
            this.data = [];
            const entities = response.data.entities || [];
            this.residentFactory(entities);
        }));
    }

    residentFactory(entities) {
        entities.forEach((suiteUser) => {
            if (!suiteUser.user) return;
            const resident = suiteUser.user;
            const phonesArr: Array<UserPhoneType> = [];
            const addressesArr: Array<UserAddressType> = [];
            const groups = [];

            resident.phones.forEach((phone) => {
                phonesArr.push(new UserPhoneType(
                    phone.isPrimaryPhone,
                    phone.phone,
                    phone.phoneType,
                    phone.user
                ));
            });

            resident.addresses.forEach((address) => {
                addressesArr.push(new UserAddressType(
                    address.isPrimaryAddress,
                    address.country,
                    address.state,
                    address.city,
                    address.address,
                    address.postalCode,
                    address.user
                ));
            });
            resident.groups.forEach((item) => {
                groups.push({id: item.group.id, itemName: item.group.name});
            });

            const newResident = new Resident();
            newResident.id = resident.id;
            newResident.suiteUserId = suiteUser.id;
            if (resident.email)                   newResident.email                   = resident.email;
            if (resident.fullName)                newResident.fullName                = resident.fullName;
            if (resident.dateOfBirth)             newResident.dateOfBirth             = resident.dateOfBirth;
            if (addressesArr.length)              newResident.addresses               = addressesArr;
            if (phonesArr.length)                 newResident.phones                  = phonesArr;
            newResident.groups                                                        = groups;
            if (resident.emergencyContact)        newResident.emergencyContact        = resident.emergencyContact;
            if (resident.emergencyAssistantNotes) newResident.emergencyAssistantNotes = resident.emergencyAssistantNotes;
            if (suiteUser.role)                   newResident.role                    = suiteUser.role;
            if (resident.emailWaiverSigned)       newResident.emailWaiverSigned       = resident.emailWaiverSigned ? 1 : 0;
            if (resident.parcelWaiverSigned)      newResident.parcelWaiverSigned      = resident.parcelWaiverSigned ? 1 : 0;
            if (resident.keyWaiverSigned)         newResident.keyWaiverSigned         = resident.keyWaiverSigned ? 1 : 0;
            if (resident.maxTvUser)               newResident.maxTvUser               = resident.maxTvUser ? 1 : 0;

            if (suiteUser.suite)                  newResident.suiteId                 = suiteUser.suite.id;
            if (suiteUser.suite)                  newResident.suiteNumber             = suiteUser.suite.suiteNumber;
            if (suiteUser.building)               newResident.buildingId              = suiteUser.building.id;
            if (suiteUser.building)               newResident.buildingName            = suiteUser.building.name;

            const selItem = this.directoryService.selectedItemData;
            if(selItem && selItem.id == suiteUser.user.id) newResident.checked = true;

            this.data.push(newResident);
        });
        this.fillEmptyRow();
    }

    getPrimaryPhone(resident: Resident): string {
        for (let i = 0; i < resident.phones.length; i++) {
            if (resident.phones[i].isPrimaryPhone) {
                return PhoneTransformer.stringToPhone(resident.phones[i].phone);
            }
        }
        return '';
    }

}
