import {Component} from '@angular/core';
import {DocumentsService} from '../../../services/documents.service';
import {Document} from '../../../types/document-data.types';

@Component({
    selector: 'documents-list',
    templateUrl: './documents-list.component.html',
    styleUrls: ['./documents-list.component.scss']
})
export class DocumentsListComponent {

    constructor(public ds: DocumentsService) {}

    orderBy(orderBy: string, $event) {
        if (this.ds.data.total < 2) return;
        this.ds.urlService.orderBy(orderBy, $event);
    }

    showDocumentViewModal(document: Document) {
        this.ds.documentInViewModal = document;
        this.ds.isDocumentViewModalShow = true;
    }
}
