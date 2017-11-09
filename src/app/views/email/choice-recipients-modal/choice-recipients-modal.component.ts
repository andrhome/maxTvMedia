import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EmailService} from '../../../services/email.service';
import {Email} from '../../../types/email-data.types';
import {FilterRecipients} from '../../../services/filter-recipients';

@Component({
    selector: 'choice-recipients-modal',
    templateUrl: './choice-recipients-modal.component.html',
    styleUrls: ['./choice-recipients-modal.component.scss']
})
export class ChoiceRecipientsComponent implements OnInit {
    @Output() save: EventEmitter<any> = new EventEmitter<any>();
    showModal = false;
    data: Email = new Email();
    filter: FilterRecipients;

    constructor(public es: EmailService) {}

    ngOnInit(): void {
        this.filter = this.es.filterRecipients;
        setTimeout(() => this.showModal = true, 300);
    }

    hideModal(): void {
        this.es.isChoiceRecipientsModalShow = false;
    }

    saveRecipients() {
        this.save.emit(this.es.filterRecipients.getFilterState());
        this.hideModal();
    }

}

