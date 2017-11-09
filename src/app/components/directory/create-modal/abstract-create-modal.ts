import {OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {DirectoryService} from '../../../services/directory.service';
import {Suite} from '../../../types/data.types';
import {ApiClientService} from '../../../services/api-client.service';
import {ConstantsService} from '../../../services/constants.service';

declare const $: any;
declare const toastr: any;
declare const swal: any;

export class AbstractCreateModalComponent implements OnInit {
    @Output() onPopupClose: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() closeTrigger: Function;
    @ViewChild('form') form;
    title = '';
    suites = [];
    showModal = false;
    @Input() buildingId = this.directoryService.selectedBuilding;
    @Input() suiteId = '';
    @Input() inDirectoryItemView = false; // модалка вызвана на /#/directory/item/...
    disabledSubmit = false;

    constructor(public directoryService: DirectoryService,
                public api: ApiClientService) {
    }

    ngOnInit() {
        setTimeout(() => this.showModal = true, 300);

        this.directoryService.getBuildings();
        this.directoryService.getCountries();
        if (this.buildingId) this.getSuitesByBuildingId(+this.buildingId);
    }

    closeModal() {
        if (this.closeTrigger) {
            this.closeTrigger();
        } else {
            this.directoryService.hideModal();
        }
    }

    create(data): void {
        this.disabledSubmit = true;
        const url = this.directoryService.getUrl('post');
        this.api.post('domainBD', url, data).subscribe(
            (res) => this.updateView(this.title + ' successfully created'),
            (error) => {
                this.api.errorHandler(error, this.title + ' was not created');
                this.disabledSubmit = false;
            }, () => this.disabledSubmit = false);
    }

    getSuitesByBuildingId(id: number) {
        if (!id) return;
        if (this.suites.length) this.form.controls.suite.setValue('');
        this.suites = [];
        // const url = `/v1/buildings/${id}.json?expand=suites&order-by=suite.suiteNumber|asc`;
        const url = `/v1/suites.json?per-page=1000&order-by=suiteNumber|asc&building_id=${id}`;
        this.api.get('domainBD', url).subscribe(
            (res) => {
                const suites = JSON.parse(res._body).entities || [];
                suites.forEach((item) => {
                    const suite = new Suite(item.id, item.suiteNumber);
                    this.suites.push(suite);
                });
            },
            (error) => this.api.errorHandler(error, 'Failed get suites')
        );
    }

    updateView(msg: string) {
        if (msg) toastr.success(msg);

        if (this.inDirectoryItemView) this.onPopupClose.emit();
        else this.directoryService.getData();

        this.directoryService.hideModal();

    }

    onClose(form) {
        if (form.dirty && form.touched) {
            swal(ConstantsService.getSwalConfig('Close without saving?', 'You want to delete unsaved data?'),
                () => {
                    this.closeModal();
                }
            );
        } else {
            this.closeModal();
        }
    }

    suiteToSearchSelect(arr: Array<Suite>) {
        return arr.map(
            suite => (
                {value: suite.id, optionText: suite.suiteNumber}
            )
        );
    }

}
