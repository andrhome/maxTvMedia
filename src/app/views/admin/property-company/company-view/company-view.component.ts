import {Component, OnInit} from '@angular/core';
import {Company, Theme} from '../../../../types/admin-data.types';
import {AdminService} from '../../../../services/admin.service';
import {PhoneTransformer} from '../../../../services/transformer.service';

declare const toastr;

@Component({
    selector: 'company-view',
    templateUrl: 'company-view.component.html',
    styleUrls: ['company-view.component.scss']
})
export class CompanyViewComponent implements OnInit {
    activeTab = 'offices';

    get company(): Company {
        return this.adm.companies.find(i => i.checked);
    };

    get theme(): Theme {
        return this.company && this.company.theme ?
            this.adm.allThemes.find(i => i.id === this.company.theme) : new Theme;
    }

    constructor(public adm: AdminService) {}

    ngOnInit() {
    }

    hideDetailedView() {
        this.adm.isShowCompanyDetailedView = false;
        this.adm.companies.forEach(i => i.checked = false);
    }

    update(fieldName, value) {
        this.company[fieldName] = value;
        const data = {};
        data[fieldName] = value;
        this.adm.api.patch('oauthUrl', `/api/v1/company/${this.company.id}.json`, data).subscribe(
            () => this.updateView('Company successfully updated'),
            error => {
                this.adm.api.errorHandler(error, 'Edit company failed');
            }
        );
    }

    updateView(msg: string): void {
        toastr.success(msg);
    }

    formatPhone(phone: string) {
        return PhoneTransformer.stringToPhone(phone);
    }

}

