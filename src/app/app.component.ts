import {Component} from '@angular/core';

declare const toastr: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor() {
        toastr.options = {
            'closeButton': true,
            'debug': false,
            'progressBar': true,
            'preventDuplicates': false,
            'positionClass': 'toast-top-right',
            'onclick': null,
            'showDuration': '400',
            'hideDuration': '1000',
            'timeOut': '7000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
    }

}
