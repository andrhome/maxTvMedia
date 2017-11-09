import {Component} from '@angular/core';
import {EmailService} from '../../../services/email.service';
import {Email} from '../../../types/email-data.types';

@Component({
    selector: 'email-list',
    templateUrl: './email-list.component.html',
    styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent {

    constructor(public es: EmailService) {}

    orderBy(orderBy: string, $event) {
        if (this.es.data.total < 2) return;
        this.es.urlService.orderBy(orderBy, $event);
    }

    showEmailViewModal(email: Email) {
        this.es.emailInViewModal = email;
        this.es.isEmailViewModalShow = true;
    }

}
