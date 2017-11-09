import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {UrlService} from '../../services/url.service';

@Component({
    selector: 'parcels-filter',
    templateUrl: './parcels-filter.component.html',
    styleUrls: ['./parcels-filter.component.scss']
})
export class ParcelsFilterComponent implements OnInit {
    showDropdown = false;
    @ViewChild('incomingCheckbox') incoming: ElementRef;
    @ViewChild('outgoingCheckbox') outgoing: ElementRef;
    @ViewChild('pickedUpCheckbox') pickedUp: ElementRef;
    @ViewChild('receivedCheckbox') received: ElementRef;
    @ViewChild('returnedCheckbox') returned: ElementRef;
    @ViewChild('canceledCheckbox') canceled: ElementRef;

    constructor(
        private urlService: UrlService
    ) {}

    ngOnInit() {
        const inOut = this.urlService.queryParams['inOut'];
        this.incoming.nativeElement.checked = inOut === 'Incoming';
        this.outgoing.nativeElement.checked = inOut === 'Outgoing';

        const status = this.urlService.queryParams['status'];
        if (status) {
            this.pickedUp.nativeElement.checked = status.indexOf('pickedUp') !== -1;
            this.received.nativeElement.checked = status.indexOf('received') !== -1;
            this.returned.nativeElement.checked = status.indexOf('returned') !== -1;
            this.canceled.nativeElement.checked = status.indexOf('canceled') !== -1;
        }
    }

    changeFilter() {
        const incomingValue = this.incoming.nativeElement.checked;
        const outgoingValue = this.outgoing.nativeElement.checked;

        const pickedUpValue = this.pickedUp.nativeElement.checked;
        const receivedValue = this.received.nativeElement.checked;
        const returnedValue = this.returned.nativeElement.checked;
        const canceledValue = this.canceled.nativeElement.checked;

        if ( (incomingValue && outgoingValue) || (!incomingValue && !outgoingValue)) {
            this.urlService.queryParams['inOut'] = null;
        } else if (incomingValue) {
            this.urlService.queryParams['inOut'] = 'Incoming';
        } else if (outgoingValue) {
            this.urlService.queryParams['inOut'] = 'Outgoing';
        }

        if (!pickedUpValue && !receivedValue && !returnedValue && !canceledValue) {
            this.urlService.queryParams['status'] = null;
        } else {
            let status = '';
            if (pickedUpValue) status += 'picked_up,';
            if (receivedValue) status += 'received,';
            if (returnedValue) status += 'returned,';
            if (canceledValue) status += 'canceled,';
            this.urlService.queryParams['status'] = status.slice(0, -1);
        }
        this.urlService.setQueryParams(null, 1);
    }

    @HostListener('document:click', ['$event.target'])
    hideDropdown(targetElement: HTMLElement): void {
        if (!targetElement.closest('parcels-filter')) this.showDropdown = false;
    }

}
