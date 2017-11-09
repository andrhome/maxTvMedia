import {Injectable} from '@angular/core';
import {ApiClientService} from './api-client.service';
import {Attachment, Email, RecipientMailingResult} from '../types/email-data.types';
import {UrlService} from './url.service';
import {Building, Group} from '../types/data.types';
import {FilterRecipients} from './filter-recipients';
import {EmptyRowService} from './empty-row.service';

declare const toastr: any;
declare const swal: any;
declare const $: any;

@Injectable()
export class EmailService {
    isEmailViewModalShow        = false;
    isMailingResultModalShow    = false;
    isChoiceRecipientsModalShow = false;
    isViewAttachmentModalShow   = false;

    emailInMailingResultModal: Email;
    emailInViewModal:          Email;
    emailInComposePage:        Email;
    attachmentInViewAttachmentModal: Attachment = new Attachment;

    data: { entities: Email[], total: number } = {
        entities: [],
        total: null
    };

    spinnerShow = false;
    buildings: Building[] = [];
    groups:    Group[]    = [];
    filterRecipients: FilterRecipients;

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
                this.initFilter();
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
                this.initFilter();
            },
            error => this.api.errorHandler(error, 'Failed get groups'));
    }

    initFilter() {
        if (this.buildings.length && this.groups.length) this.filterRecipients = new FilterRecipients(this);
    }

    getAllMailings() {
        this.spinnerShow = true;
        this.data.total  = null;

        const baseUrl     = '/api/v1/mailings.json';
        const queryParams = this.urlService.getQueryParamsString();
        const url         = `${baseUrl}${queryParams}`.replace('.json&', '.json?');

        this.api.get('domainEmails', url).subscribe(
            res => {
                const body = JSON.parse(res._body);
                this.data.entities = [];
                this.data.total    = body.total;
                this.mailingsFactory(body.entities);
                this.emptyRowService.fillEmptyRow();
                this.spinnerShow = false;
            },
            error => this.api.errorHandler(error, 'Failed get Emails')
        );
    }

    mailingsFactory(entities) {
        for (const key in entities) {
            const item  = entities[key];
            const email = new Email();

            if (item.id             ) email.id              = item.id;
            if (item.sender         ) email.sender          = item.sender;
            if (item.subject        ) email.subject         = item.subject;
            if (item.message        ) email.message         = item.message;
            if (item.pmName         ) email.pmName          = item.pmName;
            if (item.pmEmail        ) email.pmEmail         = item.pmEmail;
            if (item.pmMobilePhone  ) email.pmMobilePhone   = item.pmMobilePhone;
            if (item.buildingName   ) email.buildingName    = item.buildingName;
            if (item.buildingAddress) email.buildingAddress = item.buildingAddress;
            if (item.sendMeCopy     ) email.sendMeCopy      = item.sendMeCopy;
            if (item.status         ) email.status          = item.status;
            if (item.filters        ) email.filters         = JSON.parse(item.filters);
            if (item.recipients     ) email.recipients      = item.recipients;
            if (item.createdAt      ) email.createdAt       = item.createdAt;
            if (item.recipientsCount) email.recipientsCount = item.recipientsCount;
            if (item.sentCount      ) email.sentCount       = item.sentCount;
            email.attachments = item.attachments.map(
                at => new Attachment(at.name, at.fileSize, at.path)
            );

            this.data.entities.push(email);
        }
    }

    showAttachment(attachment: Attachment) {
        if (attachment.isImage()) {
            this.attachmentInViewAttachmentModal = attachment;
            this.isViewAttachmentModalShow = true;
        } else if (attachment.isNeedViewer()) {
            attachment.openViewer();
        } else {
            attachment.downloadAttachment();
        }
    }

    showMailingResultModal(_email: Email) {
        this.spinnerShow = true;
        // const url        = `/api/v1/mailings/${email.id}.json?expand=recipients`;
        const url        = `/api/v1/recipients.json?per-page=10000&emailMessageId=${_email.id}`;

        this.api.get('domainEmails', url).subscribe(
            res => {
                const resBody = JSON.parse(res._body);
                const email   = new Email();
                email.id      = resBody.id;
                email.filters = _email.filters;

                for (const key in resBody.entities) {
                    const _resident  = resBody.entities[key];
                    const r = new RecipientMailingResult();
                    r.id    = _resident.id;
                    if (_resident.suiteName)    r.suiteName    = _resident.suiteName;
                    if (_resident.buildingName) r.buildingName = _resident.buildingName;
                    if (_resident.name)         r.name         = _resident.name;
                    if (_resident.type)         r.type         = _resident.type;
                    if (_resident.email)        r.email        = _resident.email;
                    if (_resident.status)       r.status       = _resident.status;

                    email.recipients.push(r);
                }

                this.emailInMailingResultModal = email;
                this.isMailingResultModalShow  = true;
                this.spinnerShow = false;
            },
            error => this.api.errorHandler(error, 'Failed get Email for MailingResultModal')
        );
    }

}
