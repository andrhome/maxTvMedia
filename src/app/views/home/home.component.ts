import {Component} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

declare const $: any;

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
})
export class HomeComponent {

    constructor(
        public authenticationService: AuthenticationService
    ) {}

    toggleNews() {
        $('#newContent').slideToggle(200);
    }

}

