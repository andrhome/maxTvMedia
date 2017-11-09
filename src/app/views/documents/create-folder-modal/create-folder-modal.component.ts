import {Component, OnInit} from '@angular/core';
import {DocumentsService} from '../../../services/documents.service';

@Component({
    selector: 'create-folder-modal',
    templateUrl: './create-folder-modal.component.html',
    styleUrls: ['./create-folder-modal.component.scss']
})
export class CreateFolderModalComponent implements OnInit {
    showCreateModal = false;

    constructor(public ds: DocumentsService) {}

    ngOnInit() {
        setTimeout(() => this.showCreateModal = true);
    }

    hideCreateFolderModal() {
        this.ds.isCreateFolderModalShow = false;
    }
}
