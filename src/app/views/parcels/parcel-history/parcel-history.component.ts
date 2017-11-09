import {Component, OnInit} from '@angular/core';
import {ParcelsService} from '../../../services/parcels.service';
import {HistoryItem} from '../../directory-item/activity/history-item.class';

@Component({
    selector: 'parcel-history',
    templateUrl: 'parcel-history.component.html',
})
export class ParcelHistoryComponent implements OnInit {
    parcelNumber: string;
    parcelId: number;
    suiteId: number;
    showModal = false;
    activities: HistoryItem[] = [];

    constructor(
        public parcelsService: ParcelsService,
    ) {}

    ngOnInit() {
        this.parcelId      = this.parcelsService.parcelInHistoryModal.id;
        this.parcelNumber  = this.parcelsService.parcelInHistoryModal.parcelNumber;
        this.suiteId       = this.parcelsService.parcelInHistoryModal.suiteId;
        this.getActivityParcels();
        setTimeout( () => this.showModal = true, 300);
    }

    getActivityParcels() {
        const url = `/v1/history.json?per-page=1000&order-by=loggedAt|desc&objectId=${this.parcelId}`;
        this.parcelsService.api.get('domainParcels', url).subscribe(
            res   => this.activities = res.json().map(a => new HistoryItem(a)),
            error => this.parcelsService.api.errorHandler(error, 'Failed get Parcels')
        );
    }

    hideModal() {
        this.parcelsService.isParcelHistoryModalShow = false;
        this.parcelsService.parcelInHistoryModal = null;
    }

}
