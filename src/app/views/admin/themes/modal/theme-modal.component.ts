import {Component, OnInit, ViewChild} from '@angular/core';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {NgForm} from '@angular/forms';
import {ConstantsService} from '../../../../services/constants.service';
import {AdminService} from '../../../../services/admin.service';
import {Theme} from '../../../../types/admin-data.types';

declare const $;
declare const swal;
declare const toastr;

@Component({
    selector: 'theme-modal',
    templateUrl: 'theme-modal.component.html',
    styleUrls: ['theme-modal.component.scss']
})
export class ThemeModalComponent implements OnInit {
    @ViewChild('form') form;
    showModal = false;
    data: Theme = new Theme();
    disabledSubmit = false;
    disabledFileInput = false;
    spinnerShow = {logo: false, miniLogo: false };

    constructor(public adm: AdminService, private http: Http) {}

    ngOnInit() {
        if (this.adm.themeInModal) this.data = this.adm.themeInModal;
        this.initColorPickers();
        setTimeout( () => this.showModal = true, 300);
    }

    hideModal() {
        if (this.form.dirty && this.form.touched) {
            swal(ConstantsService.getSwalConfig('Close without saving?', 'You want to delete unsaved data?'),
                () => {
                    this.adm.isShowThemeModal = false;
                    this.adm.themeInModal     = null;
                }
            );
        } else {
            this.adm.isShowThemeModal = false;
            this.adm.themeInModal     = null;
        }
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            if (!form.value.name) toastr.warning('Name should not be blank.');
            return;
        }

        const data: any = {
            name:     form.value.name,
            logo:     this.data.logo,
            settings: this.getSettingsFromForm(),
        };

        this.disabledSubmit = true;

        if (this.data.id) {
            this.adm.api.patch('oauthUrl', `/api/v1/theme/${this.data.id}.json`, data).subscribe(
                () => this.updateView('Theme successfully updated'),
                error => {
                    this.disabledSubmit = false;
                    this.adm.api.errorHandler(error, 'Edit theme failed');
                }
            );
        } else {
            this.adm.api.post('oauthUrl', '/api/v1/theme.json', data).subscribe(
                () => this.updateView('Theme successfully created'),
                error => {
                    this.disabledSubmit = false;
                    this.adm.api.errorHandler(error, 'Create theme failed');
                }
            );
        }
    }

    updateView(msg: string): void {
        toastr.success(msg);
        this.adm.getThemes();
        this.form.reset();
        this.hideModal();
    }

    changeLogo(e, target: string) {
        if (this.disabledFileInput) return;
        const file = e.target.files[0];
        const fd   = new FormData();
        e.target.value = null;

        fd.append('fileUpload', file);
        fd.append('_format', 'json');

        const token   = sessionStorage.getItem('token');
        const headers = new Headers({'Authorization': `Bearer ${token}`});
        const options = new RequestOptions({headers: headers});

        this.spinnerShow[target] = true;
        this.disabledFileInput = true;
        this.http.post(`${ConstantsService.domainEmails}/_uploader/attachments/upload`, fd, options)
            .map((response: Response) => response.json()).subscribe(
            res => {
                if (!res.path) { toastr.warning('File path should not be blank.'); return; }
                this.data[target]      = res.path;
                this.spinnerShow[target]       = false;
                this.disabledFileInput = false;
            },
            error => {
                this.adm.api.errorHandler(error, 'Upload file failed');
                this.spinnerShow[target]       = false;
                this.disabledFileInput = false;
            }
        );
    }

    removeLogo(e, target: string) {
        e.preventDefault();
        swal(ConstantsService.getSwalConfig('Remove Logo?', 'You want to delete Logo?'),
            () => {
                this.data[target] = '';
            }
        );
    }

    initColorPickers() {
        $('#body-bg')
            .colorpicker({
                color: this.data.colors.body,
                sliders: {
                    saturation: {maxLeft: 200, maxTop: 200},
                    hue: {maxTop: 200},
                },
                customClass: 'colorpicker-2x',
            })
            .on('changeColor', ev => this.data.colors.body = ev.color.toHex());

        $('#primary-color')
            .colorpicker({
                color: this.data.colors.primary,
                sliders: {
                    saturation: {maxLeft: 200, maxTop: 200},
                    hue: {maxTop: 200},
                },
                customClass: 'colorpicker-2x',
            })
            .on('changeColor', ev => this.data.colors.primary = ev.color.toHex());
        $('#primary-hover-color')
            .colorpicker({
                color: this.data.colors.primaryHover,
                sliders: {
                    saturation: {maxLeft: 200, maxTop: 200},
                    hue: {maxTop: 200},
                },
                customClass: 'colorpicker-2x',
            })
            .on('changeColor', ev => this.data.colors.primaryHover = ev.color.toHex());

    }

    getSettingsFromForm() {
        let obj = {
            colors: {
                body: this.data.colors.body,
                primary: this.data.colors.primary,
                primaryHover: this.data.colors.primaryHover
            },
            miniLogo: this.data.miniLogo
        };

        return JSON.stringify(obj);
    }

}


