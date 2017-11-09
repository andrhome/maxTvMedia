import {Input, Output, EventEmitter, OnChanges, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl} from '@angular/forms';

export abstract class AbstractFieldClass implements OnInit, OnChanges, ControlValueAccessor {
    @Input('value') _value: any = '';
    @Input('id') _id: number;
    @Input() editOnly = false;
    @Input() noEdit = false;
    @Input() required = false;
    @Output() update: EventEmitter<any> = new EventEmitter<any>();

    originValue: any;
    isEditMode = false;

    get value() { return this._value; }

    set value(val) {
        this._value = val;
        this.propagateChange(val);
    }

    ngOnInit() {
        if (this.editOnly) this.editModeOn();
        else this.copyValue();
    }

    ngOnChanges(inputs) {
        this.editModeOff();
        this.copyValue();
        this.propagateChange(this.value);
    }

    editModeOn(): void { this.isEditMode = true; }

    editModeOff(): void { this.isEditMode = false; }

    apply(form?): void {
        if (this.required && !this.value) return;
        if (!this.editOnly) {
            this.editModeOff();
            this.update.emit();
            this.copyValue();
        }
    }

    cancel(): void {
        this.editModeOff();
        this.reset();
    }

    reset(): void {
        if (this.value && typeof this.value === 'object') {
            this.value = JSON.parse(this.originValue);
        } else {
            this.value = this.originValue;
        }
    }

    abstract validator(value: any): boolean;

    copyValue() {
        if (this.value) {
            if (typeof this._value === 'object') {
                this.originValue = JSON.stringify(this.value);
            } else {
                this.originValue = this.value;
            }
        } else {
            this.originValue = '';
        }
    }

    writeValue(value) {
        if (value) {
            this.value = value;
            this.copyValue();
        }
    }

    propagateChange: any = () => {};
    registerOnChange(fn) { this.propagateChange = fn; }
    registerOnTouched() {}
    validate(c: FormControl) { return this.validator(c); }

}
