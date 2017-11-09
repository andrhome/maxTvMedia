import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ConstantsService} from '../../../../services/constants.service';
import {AdminService} from '../../../../services/admin.service';
import {Company} from '../../../../types/admin-data.types';

declare const swal;
declare const toastr;

@Component({
    selector: 'company-modal',
    templateUrl: 'company-modal.component.html',
    styleUrls: ['company-modal.component.scss']
})
export class CompanyModalComponent implements OnInit {
    @ViewChild('form') form;
    showModal = false;
    data: Company = new Company();
    disabledSubmit = false;

    constructor(public adm: AdminService) {}

    ngOnInit() {
        setTimeout( () => this.showModal = true, 300);
    }

    hideModal() {
        if (this.form.dirty && this.form.touched) {
            swal(ConstantsService.getSwalConfig('Close without saving?', 'You want to delete unsaved data?'),
                () => this.adm.isShowCompanyModal = false
            );
        } else {
            this.adm.isShowCompanyModal = false;
        }
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            if (!form.value.name)    toastr.warning('Name should not be blank.');
            if (!form.value.email)   toastr.warning('Email should not be blank.');
            if (!form.value.address) toastr.warning('Address should not be blank.');
            if (!form.value.phone)   toastr.warning('Phone should not be blank.');
            return;
        }

        const data: any = {
            name: form.value.name,
            email: form.value.email,
            address: form.value.address,
            phone: form.value.phone,
            theme: form.value.theme,
        };

        this.disabledSubmit = true;

        this.adm.api.post('oauthUrl', '/api/v1/company.json', data).subscribe(
            () => this.updateView('Company successfully created'),
            error => {
                this.disabledSubmit = false;
                this.adm.api.errorHandler(error, 'Create company failed');
            }
        );

    }

    updateView(msg: string): void {
        toastr.success(msg);
        this.adm.getCompanies();
        this.form.reset();
        this.hideModal();
    }
    

}


