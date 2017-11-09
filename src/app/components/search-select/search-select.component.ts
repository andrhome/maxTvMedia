import {Component, forwardRef, HostListener, Input} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'search-select',
    templateUrl: './search-select.component.html',
    styleUrls: ['./search-select.component.scss'],
    providers: [{
        useExisting: forwardRef(() => SearchSelectComponent),
        provide: NG_VALUE_ACCESSOR, multi: true
    }]
})
export class SearchSelectComponent  implements ControlValueAccessor {
    @Input() data: Array<{value: string, optionText: string}> = [];
    showDropdown = false;
    searchStr = '';
    selectedValue: string;
    focusIndex = 0;
    filteredDataArray: Array<{value: string, optionText: string}> = [];

    get selectedText(): string {
        const selectedItem = this.data.find(i => i.value == this.selectedValue);
        return selectedItem ? selectedItem.optionText : '';
    };
    get value(): any {
        return this.selectedValue;
    };

    set value(v: any) {
        if (v !== this.selectedValue) {
            this.selectedValue = v;
            this.onChangeCallback(v);
        }
    }

    select() {
        const item        = this.filteredDataArray[this.focusIndex];
        this.value        = item.value;
        this.showDropdown = false;
    }

    filteredData() {
        this.focusIndex = 0;
        this.filteredDataArray =
            this.searchStr
                ?
                this.data.filter(item => {
                    return item.optionText.toLowerCase().indexOf(this.searchStr.toLowerCase()) !== -1;
                })
                :
                this.data;
    }

    toggleDropdown(searchInput) {
        if (this.data.length) {
            this.showDropdown = !this.showDropdown;
            if (this.showDropdown) {
                setTimeout(() => { searchInput.focus(); }, 100);
                this.filteredData();
            }
        }
    }

    onKeydownArrowUp() {
        if (this.focusIndex > 0) this.focusIndex--;
    }

    onKeydownArrowDown() {
        if (this.focusIndex < this.filteredDataArray.length - 1 ) this.focusIndex++;
    }

    onKeydownEnter(e) {
        this.select();
        e.preventDefault();
    }

    writeValue(value: any) {
        if (value !== this.selectedValue) {
            this.selectedValue = value;
        }
    }

    private onTouchedCallback: () => void = () => {};
    private onChangeCallback: (_: any) => void = () => {};
    registerOnChange(fn: any) { this.onChangeCallback = fn; }
    registerOnTouched(fn: any) { this.onTouchedCallback = fn; }

    @HostListener('document:click', ['$event.target'])
    hideDropdown(targetElement: HTMLElement): void {
        if (!targetElement.closest('search-select')) this.showDropdown = false;
    }

}
