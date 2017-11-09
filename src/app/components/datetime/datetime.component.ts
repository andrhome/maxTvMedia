import {Component, Input, AfterViewInit, OnDestroy, forwardRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DatePipe} from '@angular/common';

declare const $: any;
const CUSTOM_ACCESSOR = {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Datetime), multi: true };

@Component({
    selector: 'datetime',
    providers: [CUSTOM_ACCESSOR],
    template: `
        <div class="input-group">
            <span (click)="datepicker.datepicker('show')" class="input-group-addon"><i class="fa fa-calendar"></i></span>
            <input id="{{idDatePicker}}" type="text" class="form-control"
                   [required]="required"
                   [placeholder]="'Choose date'"
                   autocomplete="off">
        </div>
    `
})

export class Datetime implements ControlValueAccessor, AfterViewInit, OnDestroy {
    @Input() required = false;
    dateModel = '';
    datepicker: any;
    idDatePicker: string = uniqueId('q-datepicker_');
    datepickerOptions = {
        startView: 2,
        todayBtn: 'linked',
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: 'dd.mm.yyyy',
        endDate: '0d'
    };

    get value(): string {
        return this.dateModel;
    };

    set value(v: string) {
        if (v !== this.dateModel) {
            this.dateModel = v;
            this.onChangeCallback(v);
            if (v && this.datepicker) this.datepicker.datepicker('update', this.dateFormatStr);
        }
    }

    get dateFormatStr(): string {
        return (new DatePipe('en-US')).transform(this.value, 'dd.MM.yyyy');
    }

    ngAfterViewInit() {
        this.datepicker = $('#' + this.idDatePicker)
            .datepicker(this.datepickerOptions)
            .on('changeDate', (e: any) => {
                if ( e.target.value.length === 10)
                    this.value = (new DatePipe('en-US')).transform(e.date, 'yyyy-MM-dd');
            })
            .on('clearDate', () => {
                this.datepicker.datepicker('update', null);
                this.value = '';
            });
    }

    writeValue(value: string) {
        this.value = value;
    }

    onTouchedCallback: () => void = () => {};
    onChangeCallback: (_: any) => void = () => {};
    registerOnChange(fn: any) { this.onChangeCallback = fn; }
    registerOnTouched(fn: any) { this.onTouchedCallback = fn; }

    ngOnDestroy() {
        if (this.datepicker) this.datepicker.datepicker('destroy');
    }

}

let id = 0;
function uniqueId(prefix: string): string {
    return prefix + ++id;
}
