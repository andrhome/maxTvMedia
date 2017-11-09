import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {UrlService} from '../../../services/url.service';

@Component({
    selector: 'documents-status-filter',
    templateUrl: './documents-status-filter.component.html',
    styleUrls: ['./documents-status-filter.component.scss']
})
export class DocumentsFilterComponent implements OnInit {
    showDropdown = false;
    @ViewChild('inProgressCheckbox') inProgress: ElementRef;
    @ViewChild('completedCheckbox')  completed:  ElementRef;
    @ViewChild('draftCheckbox')      draft:  ElementRef;

    constructor(
        private urlService: UrlService
    ) {}

    ngOnInit() {
        const status = this.urlService.queryParams['status'];
        if (status) {
            this.inProgress.nativeElement.checked = status.indexOf('inProgress') !== -1;
            this.completed.nativeElement.checked  = status.indexOf('completed') !== -1;
            this.completed.nativeElement.checked  = status.indexOf('draft') !== -1;
        }
    }

    changeFilter() {
        const inProgressValue = this.inProgress.nativeElement.checked;
        const completedValue  = this.completed.nativeElement.checked;
        const draftValue      = this.draft.nativeElement.checked;


        if (!inProgressValue && !completedValue && !draftValue) {
            this.urlService.queryParams['status'] = null;
        } else {
            let status = '';
            if (inProgressValue) status += 'in_progress,';
            if (completedValue)  status += 'completed,';
            if (draftValue)      status += 'draft,';
            this.urlService.queryParams['status'] = status.slice(0, -1);
        }
        this.urlService.setQueryParams(null, 1);
    }

    @HostListener('document:click', ['$event.target'])
    hideDropdown(targetElement: HTMLElement): void {
        if (!targetElement.closest('.emails-status-filter')) this.showDropdown = false;
    }
}
