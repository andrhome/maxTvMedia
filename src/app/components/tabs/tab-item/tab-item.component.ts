import {Component, Input} from '@angular/core';

@Component({
    selector: 'tab-item',
    templateUrl: './tab-item.component.html',
})
export class TabItemComponent {
    @Input() title: string;
    @Input() active = false;
    @Input() tabId: string;
}
