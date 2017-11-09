import {Injectable} from '@angular/core';
import {ApiClientService} from './api-client.service';
import {UrlService} from './url.service';
import {EmptyRowService} from './empty-row.service';
import {Company, Office, Theme} from '../types/admin-data.types';
import {ConstantsService} from './constants.service';

declare const toastr: any;
declare const swal: any;
declare const $: any;

@Injectable()
export class AdminService {
    spinnerShow = false;

    themes: Theme[] = [];
    allThemes: Theme[] = [];
    themesTotal: number | null = null;
    themeInModal: Theme;
    isShowThemeModal = false;

    companies: Company[] = [];
    companiesTotal: number | null = null;
    isShowCompanyModal = false;
    isShowCompanyDetailedView = false;

    isShowOfficeModal = false;
    officeInOfficeModal: Office;

    constructor(
        public api: ApiClientService,
        public urlService: UrlService,
        public emptyRowService: EmptyRowService,
    ) {}

    /** Themes  */
    getThemes() {
        this.spinnerShow = true;
        const queryParams = this.urlService.getQueryParamsString();
        const url = `/api/v1/theme.json?${queryParams}`;
        this.api.get('oauthUrl', url).subscribe(
            res   => {
                this.themes = [];
                const body = JSON.parse(res._body);
                body.entities.map(
                    i => this.themes.push(new Theme(+i.id, i.name, i.logo, i.settings, i.companies))
                );
                this.themesTotal = body.total;
                this.emptyRowService.fillEmptyRow();
                this.spinnerShow = false;
            },
            error => this.api.errorHandler(error, 'Failed get Themes')
        );
    }

    getAllThemes() {
        this.spinnerShow = true;
        const url = `/api/v1/theme.json?per-page=1000`;
        this.api.get('oauthUrl', url).subscribe(
            res   => {
                this.allThemes = [];
                const body = JSON.parse(res._body);
                body.entities.map(
                    i => this.allThemes.push(new Theme(+i.id, i.name, i.logo, i.settings, i.companies))
                );
                this.spinnerShow = false;
            },
            error => this.api.errorHandler(error, 'Failed get Themes')
        );
    }

    editTheme(theme: Theme) {
        this.isShowThemeModal = true;
        this.themeInModal     = Object.assign({}, theme);
    }

    removeTheme(id: number): void {
        if (!id) return;
        swal(ConstantsService.getSwalConfig('Delete Theme'),
            () => {
                const url = `/api/v1/theme/${id}.json`;
                this.api.remove('oauthUrl', url).subscribe(
                    () => {
                        toastr.success('Theme has been deleted.');
                        this.getThemes();
                    },
                    (error) => this.api.errorHandler(error, 'Delete data failed')
                );
            }
        );
    }

    /** Companies  */
    getCompanies(checkedId?: number) {
        this.spinnerShow = true;
        if (!checkedId) this.isShowCompanyDetailedView = false;
        const queryParams = this.urlService.getQueryParamsString();
        const url = `/api/v1/company.json?expand=offices.members${queryParams}`;
        this.api.get('oauthUrl', url).subscribe(
            res   => {
                this.companies = [];
                const body = JSON.parse(res._body);
                body.entities.map(
                    i => this.companies.push(new Company(
                        +i.id,
                        i.name,
                        i.email,
                        i.address,
                        i.phone,
                        +i.theme,
                        i.offices,
                        (checkedId === +i.id)
                    ))
                );
                this.companiesTotal = body.total;
                this.emptyRowService.fillEmptyRow();
                this.spinnerShow = false;
            },
            error => this.api.errorHandler(error, 'Failed get Themes')
        );
    }

    removeCompany(id: number): void {
        if (!id) return;
        swal(ConstantsService.getSwalConfig('Delete Company'),
            () => {
                const url = `/api/v1/company/${id}`;
                this.api.remove('oauthUrl', url).subscribe(
                    () => {
                        toastr.success('Company has been deleted.');
                        this.isShowCompanyDetailedView = false;
                        this.getCompanies();
                    },
                    error => this.api.errorHandler(error, 'Delete Company failed')
                );
            }
        );
    }

    toggleCheckCompany(item: Company) {
        const checked = item.checked;
        this.companies.forEach(i => i.checked = false);
        if (checked) {
            this.isShowCompanyDetailedView = false;
        } else {
            item.checked = true;
            this.isShowCompanyDetailedView = true;
        }
    }

    /** Offices  */
    addOffice(id: number) {
        this.officeInOfficeModal = new Office();
        this.officeInOfficeModal.company = id;
        this.isShowOfficeModal = true;
    }

    editOffice(office: Office) {
        this.officeInOfficeModal = Object.assign({}, office);
        this.officeInOfficeModal.members = office.members.slice();
        this.isShowOfficeModal   = true;
    }

    deleteOffice(office: Office) {
        swal(ConstantsService.getSwalConfig('Delete Office'),
            () => {
                const url = `/api/v1/office/${office.id}`;
                this.api.remove('oauthUrl', url).subscribe(
                    () => {
                        toastr.success('Office has been deleted.');
                        this.getCompanies(office.company);
                    },
                    error => this.api.errorHandler(error, 'Delete Office failed')
                );
            }
        );
    }

}
