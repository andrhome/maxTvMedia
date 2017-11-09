import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {EmailService} from '../../services/email.service';

@Component({
    templateUrl: 'email.component.html',
})
export class EmailComponent implements OnInit, OnDestroy {

    constructor(public es: EmailService) {}

    ngOnInit() {
        this.es.getBuildings();
        this.es.getGroups();
        this.es.urlService.onUrlChange.subscribe(() => {
            this.es.getAllMailings();
        });
        this.es.urlService.setQueryParams('email');
    }

    ngOnDestroy() {
        this.es.urlService.onUrlChange.observers = [];
        this.es.urlService.resetQueryParams();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.es.emptyRowService.fillEmptyRow();
    }

}


