import {Component, OnInit} from '@angular/core';
import {DocumentsService} from '../../../services/documents.service';
import {Document} from '../../../types/document-data.types';
import {FilterStateItem} from '../../../services/filter-recipients';

declare const toastr: any;

@Component({
    selector: 'documents-view-modal',
    templateUrl: './documents-view-modal.component.html',
    styleUrls: ['./documents-view-modal.component.scss']
})
export class DocumentsViewComponent implements OnInit {
    showModal = false;
    data: Document;
    recipientFilterState: FilterStateItem[] = [];
    disabledSubmit = false;

    constructor(public ds: DocumentsService) {}

    ngOnInit() {
        this.data = this.ds.documentInViewModal;
        // this.recipientFilterState = this.data.filters;
        setTimeout(() => this.showModal = true, 300);
    }


    hideModal() {
        this.ds.isDocumentViewModalShow = false;
        this.ds.documentInViewModal     = null;
    }

    // createCopy() {
    //     const email = new Document();
    //
    //     email.id              = this.data.id;
    //     email.sender          = this.data.sender;
    //     email.subject         = this.data.subject;
    //     email.message         = this.data.message;
    //     email.pmName          = this.data.pmName;
    //     email.pmEmail         = this.data.pmEmail;
    //     email.pmMobilePhone   = this.data.pmMobilePhone;
    //     email.buildingName    = this.data.buildingName;
    //     email.buildingAddress = this.data.buildingAddress;
    //     email.sendMeCopy      = this.data.sendMeCopy;
    //     email.status          = this.data.status;
    //     email.filters         = this.data.filters;
    //     email.recipients      = this.data.recipients;
    //     email.createdAt       = this.data.createdAt;
    //     email.attachments     = this.data.attachments.map(at => new Attachment(at.name, at.fileSize, at.path));
    //
    //     this.es.emailInComposePage = email;
    //     this.hideModal();
    //     this.es.urlService.router.navigate(['/email-merge/compose']);
    // }

    // send() {
    //     console.log('send draft mailing', this.data);
    //
    //     this.disabledSubmit = true;
    //     this.ds.api.patch(
    //         'domainDocuments',
    //         `/api/v1/mailings/${this.data.id}`,
    //         {status: 'in_progress'}).subscribe(
    //         () => {
    //             toastr.success('Email successfully compose');
    //             this.data.status = 'in_progress';
    //             this.hideModal();
    //         },
    //         error => this.ds.api.errorHandler(error, 'Compose email failed'),
    //         () =>  this.disabledSubmit = false
    //     );
    // }

}
