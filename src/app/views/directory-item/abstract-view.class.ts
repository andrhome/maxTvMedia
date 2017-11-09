import {Injectable, Host, OnDestroy, OnInit} from '@angular/core';
import {DirectoryItemComponent} from './directory-item.component';
import {ApiService} from '../../services/api-directory.service';

declare const swal: any;
declare const toastr: any;

@Injectable()
export abstract class AbstractView implements OnInit, OnDestroy {
    public id: number;
    public data: any;
    public title = '';

    public isCreateModal = false;

    constructor(@Host() public parent: DirectoryItemComponent,
                public api: ApiService) {
    }

    ngOnInit(): void {
        this.api.getItemId(this.parent).subscribe((id) => {
            if (id) {
                this.getData(id);
            }
        });
    }

    create(): void {
        this.showModal();
    }

    updateView(isRedirect: boolean = true): void {
        this.api.updateView(this.parent, isRedirect);
    }

    public showModal(): void {
        this.isCreateModal = true;
    }

    public hideModal(): void {
        this.isCreateModal = false;
        this.updateView(false);
    }

    update(data: any): void {
        this.api.updateItem(this.id, data).subscribe(
            () => {/*this.updateView(false)*/},
            (error) => { toastr.error('Update failed!'); }
        );
    }

    remove(): void {
        swal({
                title: 'Delete ' + this.title,
                text: 'Are you sure you want to delete?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: true
            }, () => {
                this.api.deleteItem(this.id).subscribe(() => {
                    this.updateView();
                });
            }
        );

    }

    private getData(id: number): void {
        this.data = null;
        this.api.getItem(id).subscribe((res) => {
            this.data = res;

            if (this.data) {
                if (this.data.suiteUser) {
                    this.id = this.data.suiteUser[0].id;
                    this.data.groups = res.groups.map( item => ({id: item.group.id, itemName: item.group.name}));
                } else {
                    this.id = this.data.id;
                }
            } else {
                throw new Error('Can\'t find suiteUser id');
            }
        });
    }

    updateNameInList(list: string, petId: string, field: string, fieldValue: string): void {
        const item = this.parent[list].find(i => i.id === petId );
        if (item) item[field] = fieldValue;
    }

    ngOnDestroy(): void {}

}
