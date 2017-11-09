import {Injectable} from '@angular/core';
import {ApiClientService} from './api-client.service';
import {UrlService} from './url.service';
import {Building, Group} from '../types/data.types';
import {Document} from '../types/document-data.types';
import {EmptyRowService} from './empty-row.service';

@Injectable()
export class DocumentsService {
    isDocumentViewModalShow = false;
    isCreateFolderModalShow = false;
    documentInViewModal:       Document;

    spinnerShow = false;
    buildings: Building[] = [];
    groups:    Group[]    = [];

    data: { entities: Document[], total: number } = {
        entities: [],
        total: null
    };
    constructor(
        public api: ApiClientService,
        public urlService: UrlService,
        public emptyRowService: EmptyRowService
    ) {
        this.api.onLogout.subscribe(() => this.buildings = []);
    }

    getBuildings(): void {
        if (this.buildings.length) return;
        const url = `/v1/buildings.json?per-page=1000`;
        this.api.get('domainBD', url).subscribe(
            res => {
                this.buildings = JSON.parse(res._body).entities;
                // this.initFilter();
            },
            error => this.api.errorHandler(error, 'Failed get buildings')
        );
    }

    getGroups(): void {
        if (this.groups.length) return;
        const url = `/v1/group.json?per-page=1000`;
        this.api.get('domainBD', url).subscribe(
            res => {
                this.groups = [];
                const entities = JSON.parse(res._body).entities || [];
                this.groups    = entities.map((item) => {
                    return {id: item.id, itemName: item.name, users: item.users};
                });
            },
            error => this.api.errorHandler(error, 'Failed get groups'));
    }

    getAllDocuments() {
        this.spinnerShow = true;
        this.data.total  = null;

        const baseUrl     = '/api/v1/documents.json';
        const queryParams = this.urlService.getQueryParamsString();
        const url         = `${baseUrl}${queryParams}`.replace('.json&', '.json?');

        this.api.get('domainDocuments', baseUrl).subscribe(
            res => {
                const body = JSON.parse(res._body);
                this.data.entities = [];
                this.data.total = body.total;
                this.documentsFactory(body.entities);
                this.emptyRowService.fillEmptyRow();
                this.spinnerShow = false;
            },
            error => this.api.errorHandler(error, 'Failed get Documents')
        );
    }

    documentsFactory(entities) {
        for (const key in entities) {
            const item  = entities[key];
            const document = new Document();

            if (item.id         ) document.id          = item.id;
            if (item.name       ) document.name        = item.name;
            if (item.building   ) document.building    = item.building;
            if (item.type       ) document.type        = item.type;
            if (item.permissions) document.permissions = item.permissions;
            if (item.path       ) document.path        = item.path;
            if (item.parent     ) document.parent      = item.parent;
            if (item.shared     ) document.shared      = item.shared;

            this.data.entities.push(document);
        }
    }
}
