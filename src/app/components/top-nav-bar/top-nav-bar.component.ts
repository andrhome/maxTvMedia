import {Component} from '@angular/core';

declare const $: any;

@Component({
    selector: 'top-nav-bar',
    templateUrl: 'top-nav-bar.component.html'
})
export class TopNavBarComponent {

    constructor() {}

    toggleNavigation(): void {
        const menu = $('#side-menu');
        const body = $('body');
        menu.hide();
        body.toggleClass('mini-navbar');
        if (body.hasClass('mini-navbar')) setTimeout(() => menu.fadeIn(400), 200);
        else menu.removeAttr('style');
    }

}
