import {Component, OnInit} from '@angular/core';
import {EmailService} from '../../../services/email.service';
import {Attachment, Email} from '../../../types/email-data.types';
import {FilterStateItem} from '../../../services/filter-recipients';

declare const toastr: any;

@Component({
    selector: 'email-view-modal',
    templateUrl: './email-view-modal.component.html',
    styleUrls: ['./email-view-modal.component.scss']
})
export class EmailViewComponent implements OnInit {
    showModal = false;
    data: Email;
    recipientFilterState: FilterStateItem[] = [];
    disabledSubmit = false;

    constructor(public es: EmailService) {}

    ngOnInit() {
        this.data = this.es.emailInViewModal;
        this.recipientFilterState = this.data.filters;
        setTimeout(() => this.showModal = true, 300);
    }


    hideModal() {
        this.es.isEmailViewModalShow = false;
        this.es.emailInViewModal     = null;
    }

    createCopy() {
        const email = new Email();

        email.id              = this.data.id;
        email.sender          = this.data.sender;
        email.subject         = this.data.subject;
        email.message         = this.data.message;
        email.pmName          = this.data.pmName;
        email.pmEmail         = this.data.pmEmail;
        email.pmMobilePhone   = this.data.pmMobilePhone;
        email.buildingName    = this.data.buildingName;
        email.buildingAddress = this.data.buildingAddress;
        email.sendMeCopy      = this.data.sendMeCopy;
        email.status          = this.data.status;
        email.filters         = this.data.filters;
        email.recipients      = this.data.recipients;
        email.createdAt       = this.data.createdAt;
        email.attachments     = this.data.attachments.map(at => new Attachment(at.name, at.fileSize, at.path));

        this.es.emailInComposePage = email;
        this.hideModal();
        this.es.urlService.router.navigate(['/email-merge/compose']);
    }

    send() {
        console.log('send draft mailing', this.data);

        this.disabledSubmit = true;
        this.es.api.patch(
            'domainEmails',
            `/api/v1/mailings/${this.data.id}`,
            {status: 'in_progress'}).subscribe(
            () => {
                toastr.success('Email successfully compose');
                this.data.status = 'in_progress';
                this.hideModal();
            },
            error => this.es.api.errorHandler(error, 'Compose email failed'),
            () =>  this.disabledSubmit = false
        );
    }

}
