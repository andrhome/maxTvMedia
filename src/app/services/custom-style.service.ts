import {Injectable} from '@angular/core';
import {Theme} from '../types/admin-data.types';

declare const $;

@Injectable()
export class CustomStyleService {
    obj = {
        colors: {
            body: '#f3f3f4',
            primary: '#1ab394',
            primaryHover: '#1a7794',
        },
        logo: '/assets/img/logo-maxtv-login.png',
        miniLogo: ''
    };

    constructor() {
        const cs = localStorage.getItem('mtvCustomStyle');
        if (cs) {
            const csObj        = JSON.parse(cs);
            this.obj.colors    = csObj.colors;
            this.obj.logo      = csObj.logo;
            this.obj.miniLogo  = csObj.miniLogo ? csObj.miniLogo : csObj.logo;
            this.updateStyle();
        }
    }

    updateStyle() {
        $('#mtvCustomStyle').remove();
        $(`
            <style id="mtvCustomStyle">
                /* background-color body  */
                .mtv-body-color { 
                    background-color: ${this.obj.colors.body} !important;
                }
                
                /* background-color primary  */
                .mtv-primary-bg-color,
                .btn-primary,
                .sk-spinner-wave div,
                .ss_dropdown li.focus,
                .pure-checkbox input[type="checkbox"]:checked + label:before,
                .parcel-modal .parcel-type-switch input:checked + label,
                .radio-tabs input:checked + label,
                .parcel-transit-modal .input-radio label:after,
                .datepicker table tr td span.active,
                .datepicker table tr td.active.day,
                .pace .pace-progress
                { 
                    background-color: ${this.obj.colors.primary} !important; 
                }
                
                /* hover background-color primary  */
                .mtv-primary-bg-color:hover,
                .btn-primary:hover
                { 
                    background-color: ${this.obj.colors.primaryHover} !important; 
                }
                
                /* color primary  */
                .mtv-primary-color,
                .timeline__active,
                #side-menu.nav > li.active > a,
                .item-nav__link.item-nav__link_active,
                .btn-default-green,
                .detailed-view-body .btn-default,
                .btn-in-table .btn,
                .parcel-modal .parcel-type-switch input:not(:checked) + label,
                .radio-tabs input:not(:checked) + label
                { 
                    color: ${this.obj.colors.primary} !important;
                }
                
                /* hover color primary  */
                .mtv-primary-color:hover,
                .btn-default-green:hover,
                .detailed-view-body .btn-default:hover,
                .btn-in-table .btn:hover,
                .parcel-modal .parcel-type-switch input:not(:checked) + label:hover,
                .radio-tabs input:not(:checked) + label:hover
                { 
                    color: ${this.obj.colors.primaryHover} !important;
                }
                
                /* border-color primary  */
                .btn-primary,
                .btn-default-green,
                .detailed-view-body .btn-default,
                .btn-in-table .btn,
                .parcel-modal .parcel-type-switch,
                .radio-tabs,
                .pure-checkbox input[type="checkbox"] + label:before,
                .parcel-transit-modal .input-radio label:before,
                .form-control:focus
                {
                    border-color: ${this.obj.colors.primary} !important;
                }
                
                /* hover border-color primary  */
                .btn-primary:hover,
                .btn-default-green:hover,
                .detailed-view-body .btn-default:hover,
                .btn-in-table .btn:hover,
                .parcel-modal .parcel-type-switch:hover,
                .radio-tabs:hover,
                .pure-checkbox input[type="checkbox"] + label:hover:before,
                .parcel-transit-modal .input-radio label:hover:before
                {
                    border-color: ${this.obj.colors.primaryHover} !important;
                }
                
                #side-menu.nav > li.active,
                .item-nav__link.item-nav__link_active
                {
                    border-left: 4px solid ${this.obj.colors.primary} !important;
                }
                .img-checkbox .svg-checked, 
                .img-checkbox .svg-halfchecked { 
                    fill: ${this.obj.colors.primary} !important; 
                }
                
                /* logo  */
                #side-menu .logo, .loginscreen .logo { background-image: url(${this.obj.logo}) !important; }
                body.mini-navbar #side-menu .logo { background-image: url(${this.obj.miniLogo}) !important; }
            </style>
        `).appendTo('head');
    }

    saveColor(name: string, value: string) {
        this.obj.colors[name] = value;
        this.saveState();
        this.updateStyle();
    }

    saveLogo(src: string) {
        this.obj.logo = src;
        this.saveState();
        this.updateStyle();
    }

    saveState() {
        const objJson = JSON.stringify(this.obj);
        localStorage.setItem('mtvCustomStyle', objJson);
    }

    enableTheme(theme: Theme) {
        this.obj = {
            colors: theme.colors,
            logo: theme.logo,
            miniLogo: theme.miniLogo ? theme.miniLogo : theme.logo,
        };
        this.saveState();
        this.updateStyle();
    }

}
