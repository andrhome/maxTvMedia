import {Component, OnInit} from '@angular/core';
import {EmailService} from '../../../services/email.service';
import {Email, RecipientMailingResult} from '../../../types/email-data.types';

@Component({
    selector: 'mailing-result-modal',
    templateUrl: './mailing-result-modal.component.html',
    styleUrls: ['./mailing-result-modal.component.scss']
})
export class MailingResultComponent implements OnInit {
    showModal = false;
    data: Email;
    sf: StatusFilter;

    constructor(public es: EmailService) {}

    ngOnInit(): void {
        this.data   = this.es.emailInMailingResultModal;
        this.sf = new StatusFilter(this.data.recipients);

        setTimeout(() => this.showModal = true, 300);
    }

    hideModal() {
        this.es.isMailingResultModalShow  = false;
        this.es.emailInMailingResultModal = null;
    }

    isBuildingHalfChecked(item): boolean {
        return (
            !item.tenantsChecked ||
            !item.ownerOnChecked ||
            !item.ownerOffChecked ||
            !item.notSetChecked ||
            item.tenantsHalfChecked ||
            item.ownerOnHalfChecked ||
            item.ownerOffHalfChecked ||
            item.notSetHalfChecked
        );
    }

    isResidentHalfChecked(item): boolean {
        return !item.tenantsChecked || !item.ownerOnChecked || item.tenantsHalfChecked || item.ownerOnHalfChecked;
    }

}

class StatusFilter {
    searchStr: string;
    statuses      = ['in_progress', 'sent', 'error'];
    in_progress   = true;
    sent          = true;
    error         = true;
    showDropdown  = true;
    //recipients: RecipientMailingResult[];

    constructor(public recipients: RecipientMailingResult[]) {}

    filterResidents(): RecipientMailingResult[] {
        function searchCondition(searchStr = '', resident: RecipientMailingResult) {
            searchStr = searchStr.toLowerCase();
            return !searchStr || (
                resident.suiteName.toLowerCase().indexOf(searchStr) !== -1 ||
                resident.buildingName.toLowerCase().indexOf(searchStr) !== -1 ||
                resident.name.toLowerCase().indexOf(searchStr) !== -1 ||
                resident.email.toLowerCase().indexOf(searchStr) !== -1
            );
        }

        return this.recipients.filter((resident: RecipientMailingResult) => {
            return (
                searchCondition(this.searchStr, resident) && (
                    (this.in_progress && resident.status === 'in_progress') ||
                    (this.sent        && resident.status === 'sent')        ||
                    (this.error       && resident.status === 'error')
                )
            );
        });
    }

    getLabel(status): string {
        if (status === 'in_progress') return 'In Progress';
        if (status === 'sent')        return 'Sent';
        if (status === 'error')       return 'Error';
    }

    toggleCheckedAll(state: boolean): void {
        this.in_progress = this.sent = this.error = state;
    }

    isAllStatusChecked() {
        return (this.in_progress === true && this.sent === true && this.error === true);
    }

    getUsersCountByStatus(status: string): number {
        return this.recipients.filter(r => r.status === status).length;
    }

}
