import {Component, Input} from '@angular/core';
import {EmailService} from '../../../services/email.service';
import {FilterStateItem} from "../../../services/filter-recipients";
import {ConstantsService} from '../../../services/constants.service';

declare const swal: any;

@Component({
    selector: 'recipients-filter-view',
    templateUrl: './recipients-filter-view.component.html',
    styleUrls: ['./recipients-filter-view.component.scss']
})
export class RecipientsFilterViewComponent {
    @Input() recipientFilterState: FilterStateItem[] = [];
    @Input() inViewModal = false;

    constructor(
        public es: EmailService,
    ) {}

    showChoiceRecipientsModal() {
        if (!this.inViewModal && this.es.filterRecipients) {
            this.es.isChoiceRecipientsModalShow = true;
        }
    }

    removeRecipientsBlock(i: number) {
        swal(
            ConstantsService.getSwalConfig('Delete Recipients'),
            () => this.recipientFilterState.splice(i, 1)
        );
    }

}
