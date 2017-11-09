import {AfterViewChecked, Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {CustomStyleService} from '../../services/custom-style.service';

declare const $: any;
declare const window: any;

@Component({
    selector: 'navigation',
    templateUrl: 'navigation.component.html',
    styleUrls: ['navigation.component.scss']
})

export class NavigationComponent implements AfterViewChecked {
    constructor(
        private router: Router,
        public authenticationService: AuthenticationService,
        public cs: CustomStyleService
    ) {}

    ngAfterViewChecked() {
        const $body = $('body');
        $('#side-menu').metisMenu();
        if ($(window).width() < 769) $body.addClass('body-small');
        else                         $body.removeClass('body-small');
    }

    logOut(): void {
        this.authenticationService.logout();
    }

    activeRoute(routename: string): boolean {
        return this.router.url.indexOf(routename) > -1;
    }

}
