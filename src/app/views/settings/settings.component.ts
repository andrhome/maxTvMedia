import {Component, OnInit} from '@angular/core';
import {CustomStyleService} from '../../services/custom-style.service';

declare const toastr;
declare const $;

@Component({
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
    bodyColor: string;
    primaryColor: string;
    logo: string;

    constructor(public cs: CustomStyleService) {
    }

    ngOnInit() {
        this.bodyColor = this.cs.obj.colors.body;
        this.primaryColor = this.cs.obj.colors.primary;
        this.logo = this.cs.obj.logo;

        $('#body-bg')
            .colorpicker({
                color: this.bodyColor,
                sliders: {
                    saturation: {maxLeft: 200, maxTop: 200},
                    hue: {maxTop: 200},
                    alpha: {maxTop: 200}
                },
                customClass: 'colorpicker-2x',
            })
            .on('changeColor', ev => this.bodyColor = ev.color.toHex());

        $('#primary-color')
            .colorpicker({
                color: this.primaryColor,
                sliders: {
                    saturation: {maxLeft: 200, maxTop: 200},
                    hue: {maxTop: 200},
                    alpha: {maxTop: 200}
                },
                customClass: 'colorpicker-2x',
            })
            .on('changeColor', ev => this.primaryColor = ev.color.toHex());
    }

    saveChanges() {
        this.cs.saveColor('body', this.bodyColor);
        this.cs.saveColor('primary', this.primaryColor);
        this.cs.saveLogo(this.logo);
        toastr.success('Settings saved.');
    }

    resetToDefault() {
        this.bodyColor = '#f3f3f4';
        this.primaryColor = '#1ab394';
        this.logo = '/assets/img/logo-maxtv-login.png';
        this.saveChanges();
    }

    changeLogo(e) {
        const fileImg = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.logo = e.target.result;
        };
        reader.readAsDataURL(fileImg);
    }
}

