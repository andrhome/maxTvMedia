import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ConstantsService} from '../../../../services/constants.service';
import {AdminService} from '../../../../services/admin.service';
import {Office} from '../../../../types/admin-data.types';

declare const swal;
declare const toastr;

@Component({
    selector: 'office-modal',
    templateUrl: 'office-modal.component.html',
    styleUrls: ['office-modal.component.scss']
})
export class OfficeModalComponent implements OnInit {
    @ViewChild('form') form;
    showModal = false;
    data: Office = this.adm.officeInOfficeModal;
    disabledSubmit = false;

    constructor(public adm: AdminService) {}

    ngOnInit() {
        setTimeout(() => this.showModal = true, 300);
    }

    hideModal() {
        if (this.form.dirty && this.form.touched) {
            swal(ConstantsService.getSwalConfig('Close without saving?', 'You want to delete unsaved data?'),
                () => this.adm.isShowOfficeModal = false
            );
        } else {
            this.adm.isShowOfficeModal = false;
        }
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            if (!form.value.name)  toastr.warning('Name should not be blank.');
            if (!form.value.phone) toastr.warning('Phone should not be blank.');
            return;
        }

        const data: any = {
            name:    form.value.name,
            phone:   form.value.phone,
            company: this.data.company,
            members: this.data.members.map(m => ({name: m.name, phone: m.phone}))
        };

        this.disabledSubmit = true;

        if (this.data.id) {
            this.adm.api.patch('oauthUrl', `/api/v1/office/${this.data.id}`, data).subscribe(
                () => this.updateView('Office successfully updated'),
                error => {
                    this.disabledSubmit = false;
                    this.adm.api.errorHandler(error, 'Update office failed');
                }
            );
        } else {
            this.adm.api.post('oauthUrl', '/api/v1/office.json', data).subscribe(
                () => this.updateView('Office successfully created'),
                error => {
                    this.disabledSubmit = false;
                    this.adm.api.errorHandler(error, 'Create office failed');
                }
            );
        }
    }

    updateView(msg: string): void {
        toastr.success(msg);
        this.adm.getCompanies(this.data.company);
        this.form.reset();
        this.hideModal();
    }

    addNewMember() {
        this.data.members.push({name: '', phone: ''});
    }

}
