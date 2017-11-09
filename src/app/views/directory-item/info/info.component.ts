import {Component, Host, OnInit} from '@angular/core';
import {ApiInfoService} from '../../../services/api-directory.service';
import {DirectoryItemComponent} from '../directory-item.component';

@Component({
    templateUrl: 'info.template.html',
    providers: [ApiInfoService]
})
export class InfoComponent implements OnInit {
    public data: any;
    public parent: DirectoryItemComponent;

    constructor(@Host() parent: DirectoryItemComponent,
                public api: ApiInfoService) {
        this.parent = parent;
    }

    ngOnInit(): void {
        this.getData(this.parent.suiteId);
    }

    update(data: any): void {
        this.api.updateItem(this.parent.suiteId, data).subscribe(() => {
        });
    }

    private getData(id: number): void {
        this.api.getItem(id).subscribe((res) => {
            this.data = res;
        });
    }
}
