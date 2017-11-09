import {Injectable} from '@angular/core';

declare const $: any;

@Injectable()
export class EmptyRowService {
    emptyRow: Array<number> = [];

    constructor() {}

    fillEmptyRow() {
        this.emptyRow = [];
        setTimeout(() => {
            const tableBoxHeight = $('.table-responsive').height();
            const tableHeight    = $('.table-responsive table').height();
            const trHeight       = $('.table-responsive table tbody tr:eq(0)').height();
            const emptyRowCount  = +((tableBoxHeight - tableHeight) / trHeight).toFixed(0);
            for (let i = 0; i <= emptyRowCount; i++) this.emptyRow.push(i);
        }, 100);
    }

}
