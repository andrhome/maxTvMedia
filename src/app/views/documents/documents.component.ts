import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {DocumentsService} from '../../services/documents.service';

@Component({
    templateUrl: 'documents.component.html',
})
export class DocumentsComponent implements OnInit, OnDestroy {

    constructor(public ds: DocumentsService) {}

    ngOnInit() {
        this.ds.getBuildings();
        this.ds.getGroups();
        this.ds.urlService.onUrlChange.subscribe(() => {
            this.ds.getAllDocuments();
        });
        this.ds.urlService.setQueryParams('document');
    }

    ngOnDestroy() {
        this.ds.urlService.onUrlChange.observers = [];
        this.ds.urlService.resetQueryParams();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.ds.emptyRowService.fillEmptyRow();
    }

    showCreateFolderModal() {
        this.ds.isCreateFolderModalShow = true;
    }

}


