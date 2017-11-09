import {Component, Input} from '@angular/core';

@Component({
    selector: 'spinner',
    templateUrl: './spinner.component.html'
})
export class SpinnerComponent {
    @Input() spinnerType = 'wave';
    @Input() spinnerShow = false;
}
