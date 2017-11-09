import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Datetime } from './datetime.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [Datetime],
    declarations: [Datetime]
})
export class DatetimeModule {
}
