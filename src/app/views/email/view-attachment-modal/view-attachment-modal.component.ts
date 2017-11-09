import {Component, OnInit} from '@angular/core';
import {EmailService} from '../../../services/email.service';
import {Attachment} from '../../../types/email-data.types';

@Component({
    selector: 'view-attachment-modal',
    templateUrl: './view-attachment-modal.component.html',
    styleUrls: ['./view-attachment-modal.component.scss']
})
export class ViewAttachmentModalComponent implements OnInit {
    showModal = false;
    data: Attachment;
    type: string;

    constructor(
        public es: EmailService,
    ) {}

    ngOnInit(): void {
        this.data = this.es.attachmentInViewAttachmentModal;

        setTimeout(() => this.showModal = true, 500);
    }

    hideModal(): void {
        this.es.isViewAttachmentModalShow = false;
        this.es.attachmentInViewAttachmentModal = null;
    }

}

