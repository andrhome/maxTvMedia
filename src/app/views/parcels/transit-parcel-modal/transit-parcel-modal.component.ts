import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ApiClientService} from '../../../services/api-client.service';
import {ParcelsService} from '../../../services/parcels.service';
import {Parcel, ResidentForSelect} from '../../../types/data.types';

declare const toastr: any;
declare const onDoneSign: any;

@Component({
    selector: 'transit-parcel-modal',
    templateUrl: './transit-parcel-modal.component.html',
    styleUrls: ['./transit-parcel-modal.component.scss']
})
export class TransitParcelModalComponent implements OnInit {
    @ViewChild('form') form;
    showModal = false;
    action = 'pick_up';
    parcel: Parcel;
    residents: Array<ResidentForSelect> = [];
    data: Parcel[] = [];
    disabledSubmit = false;

    constructor(
        public api: ApiClientService,
        private parcelsService: ParcelsService
    ) {}

    ngOnInit() {
        this.parcel = this.parcelsService.parcelInTransitModal;
        this.action = this.parcelsService.statusInTransitModal;
        if (+this.parcel.suiteId) {
            this.getResidents(this.parcel.suiteId);
            this.getParcelsInSuite(this.parcel.suiteId);
        } else {
            this.parcel.checked = true;
            this.data.push(this.parcel);
        }
        setTimeout(() => this.showModal = true, 300);
    }

    hideModal() {
        this.parcelsService.parcelInTransitModal = null;
        this.parcelsService.isTransitModalShow = false;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) { toastr.warning('Send data not valid'); return; }
        const data: any = {};
        data.transition = this.action;

        if (this.action === 'pick_up') {
            if (this.parcel.isOutgoingParcel()) {
                data.pickedUpByPostService = form.value.pickedUpByPostService;
            } else {
                data.pickedUpBy = this.getResidentObj(form);
            }
        } else if (this.action === 'return') {
            data.returningBy = form.value.returningBy;
        } else if (this.action === 'cancel') {
            data.cancelledBy = this.getResidentObj(form);
        }


        if (form.value.sign) { /** Вариант отправки с подписью. Юзается колбек тк. нужно дождатся ответ от сигначепада */
            onDoneSign((sigImageData) => {
                data.signBase = sigImageData;
                if (!data.signBase) { toastr.warning('Signature should not be blank.'); return; }
                this.submitRequests(data);
            });
        } else { /** Вариант отправки без подписи. */
            this.submitRequests(data);
        }

    }

    submitRequests(data) {
        this.disabledSubmit = true;
        this.data.filter(item => item.checked).forEach(item => {
            const url = `/v1/parcels/transit/${item.id}.json`;
            this.api.patch('domainParcels', url, data).subscribe(
                () => this.updateView('Parcel successfully updated'),
                error => {
                    this.disabledSubmit = false;
                    this.api.errorHandler(error, 'Update parcel failed');
                }
            );
        });
    }

    getResidentObj(form) {
        const resident = this.residents.find((r) => r.id == form.value.residentId);
        const result: any = {
            bdId:     resident ? resident.id       : 0,
            fullName: resident ? resident.fullName : form.value.otherResident,
        };

        if (resident && resident.email) result.email = resident.email;

        return result;

    }

    updateView(msg: string): void {
        toastr.success(msg);
        this.form.reset();
        this.hideModal();
        this.parcelsService.getData();
    }

    getResidents(suiteId: number): void {
        this.residents = [];
        const url = `/v1/suites/${suiteId}.json?expand=suiteUser,suiteUser.user&per-page=1000`;
        this.api.get('domainBD', url).subscribe(
            res => {
                const suite = JSON.parse(res._body);
                suite.suiteUser.forEach((item) => {
                    this.residents.push(new ResidentForSelect(item.user.id, item.user.fullName, [], item.user.email));
                });
            },
            error => this.api.errorHandler(error, 'Failed get Residents'));
    }

    getParcelsInSuite(suiteId: number) {
        this.data = [];
        const url = `/v1/parcels.json?expand=building,suite,resident,receivedBy,pickedUpBy,deliveredBy` +
            `&suite_id=${suiteId}&status[0]=received&inOut=${this.parcel.inOut}&per-page=1000&order-by=id|desc`;
        this.api.get('domainParcels', url).subscribe(
            res => {
                const body = JSON.parse(res._body);
                const entities = body.entities;
                this.parcelsService.parcelsFactory(entities, this.data);
                this.data.find((p) => p.id == this.parcel.id).checked = true;
            },
            error => this.api.errorHandler(error, 'Failed get Residents'));

    }

    toggleCheckedAll() {
        const targetValue = !this.isCheckedAll();
        this.data.map(item => item.checked = targetValue);
    }

    isCheckedAll() {
        return this.data.every(item => item.checked);
    }

    isSomeChecked() {
        return this.data.some(item => item.checked);
    }

}
