import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ApiDirectoryItemService} from '../../services/api-directory.service';
import {DirectoryService} from '../../services/directory.service';

@Component({
    selector: 'directory-item',
    templateUrl: 'directory-item.template.html',
    providers: [ApiDirectoryItemService]
})
export class DirectoryItemComponent implements OnInit, OnDestroy {

    public suiteId = 0;
    public suiteData: any;
    private sub: any;

    public residentsList: Array<any> = [];
    public parkingList: Array<any>   = [];
    public lockersList: Array<any>   = [];
    public vehicleList: Array<any>   = [];
    public petsList: Array<any>      = [];
    public bikeRacksList: Array<any> = [];

    constructor(
        private route: ActivatedRoute,
        private api: ApiDirectoryItemService,
        public directoryService: DirectoryService
    ) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params: Params) => {
            this.suiteId = parseInt(params['id']);
            this.api.getSuite(this.suiteId).subscribe((res) => {
                this.suiteData = res;
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}

