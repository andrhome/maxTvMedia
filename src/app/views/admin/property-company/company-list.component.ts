import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {PhoneTransformer} from '../../../services/transformer.service';

@Component({
    templateUrl: 'company-list.component.html',
    styleUrls: ['company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {
    constructor(public adm: AdminService) {}

    ngOnInit() {
        this.adm.urlService.onUrlChange.subscribe(() => {
            this.adm.getCompanies();
        });
        this.adm.getAllThemes();
        this.adm.urlService.setQueryParams('companies');
    }

    ngOnDestroy() {
        this.removeAllObservers();
        this.adm.urlService.resetQueryParams();
        this.adm.companies = [];
        this.adm.isShowCompanyDetailedView = false;
    }

    removeAllObservers() {
        this.adm.urlService.onUrlChange.observers = [];
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.adm.emptyRowService.fillEmptyRow();
    }

    formatPhone(phone: string) {
        return PhoneTransformer.stringToPhone(phone);
    }

}


