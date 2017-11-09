import {Injectable, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class UrlService {
    onUrlChange: EventEmitter<any> = new EventEmitter();
    queryParams;
    defaultPage    = 1;
    defaultPerPage = 15;
    defaultOrderBy: Object = {
        'residents':     'suite.suiteNumber|asc',
        'units':         'suiteNumber|asc',
        'parking-spots': 'suite.suiteNumber|asc',
        'lockers':       'suite.suiteNumber|asc',
        'vehicles':      'suite.suiteNumber|asc',
        'pets':          'suite.suiteNumber|asc',
        'bike-racks':    'suite.suiteNumber|asc',
        'allParcels':    'createdAt|desc',
        'email':         'createdAt|desc',
        'themes':        'id|asc',
        'companies':     'id|asc',
    };
    buildingFilter: Object = {
        'residents':     'suite_building',
        'units':         'building_id',
        'parking-spots': 'building_id',
        'lockers':       'building_id',
        'vehicles':      'building_id',
        'pets':          'building_id',
        'bike-racks':    'building_id',
        'allParcels':    'building_id',
        'email':         'building_id[0]',
        'document':      'building_id'
    };

    constructor(public router: Router) {
        this.getQueryParams();
    }

    getQueryParams(): void {
        this.queryParams = this.router.parseUrl(this.router.url).queryParams;
    }

    setQueryParams(tab?: string, page?: number, perPage?: number, orderBy?: string): void {
        const queryParams: any = {
            'tab'     : tab     || this.queryParams['tab'     ],
            'page'    : page    || this.queryParams['page'    ] || this.defaultPage,
            'per-page': perPage || this.queryParams['per-page'] || this.defaultPerPage,
            'order-by': orderBy || this.queryParams['order-by'] || this.defaultOrderBy[tab],
        };
        if (this.queryParams['query'])    queryParams['query']    = this.queryParams['query'];
        if (this.queryParams['building']) queryParams['building'] = this.queryParams['building'];
        if (this.queryParams['inOut'])    queryParams['inOut']    = this.queryParams['inOut'];
        if (this.queryParams['status'])   queryParams['status']   = this.queryParams['status'];

        const urlTree = this.router.createUrlTree(
            [],
            {queryParams: queryParams});
        this.router.navigateByUrl(urlTree)
            .then(() => {
                this.getQueryParams();
                this.onUrlChange.emit();
            });
    }

    getQueryParamsString(): string {
        const page     = this.queryParams['page'];
        const perPage  = this.queryParams['per-page'];
        const tab      = this.queryParams['tab'];

        const building = this.queryParams['building'] ? `&${this.buildingFilter[tab]}=${this.queryParams['building']}` : '';
        const query    = this.queryParams['query']    ? `&query=*${encodeURIComponent(this.queryParams['query'])}*`    : '';
        const inOut    = this.queryParams['inOut']    ? `&inOut=${this.queryParams['inOut']}`                          : '';
        const status   = this.queryParams['status']   ? `&${this.getStatusQueryString(this.queryParams['status'])}`    : '';
        const orderBy  = this.queryParams['order-by'] ? `&order-by=${this.queryParams['order-by']}`                    : '';

        return `&page=${page}&per-page=${perPage}${building}${query}${inOut}${status}${orderBy}`;
    }

    getStatusQueryString(status: string) {
        const arr = status.split(',');
        let result = '';
        arr.forEach((item: string, i: number) => {
            result += `status[${i}]=${item}&`;
        });
        return result.slice(0, -1);
    }

    orderBy(fieldName: string, event: any) {
        const clickedElement = (event.target.className === 'footable-sort-indicator') ? event.target.parentElement : event.target;
        const parent = clickedElement.parentElement;
        let order = 'asc';

        if (!clickedElement.className) {
            Array.prototype.forEach.call(parent.children, (item) => {
                item.removeAttribute('class');
            });
        }
        if (clickedElement.classList.contains('footable-sorted')) {
            clickedElement.classList.remove('footable-sorted');
            clickedElement.classList.add('footable-sorted-desc');
            order = 'desc';
        } else {
            clickedElement.classList.remove('footable-sorted-desc');
            clickedElement.classList.add('footable-sorted');
            order = 'asc';
        }

        const orderBy = `${fieldName}|${order}`;
        this.setQueryParams(null, null, null, orderBy);
    }

    resetQueryParams() {
        this.queryParams = {};
        const urlTree = this.router.createUrlTree([], {});
        this.router.navigateByUrl(urlTree);
    }

}
