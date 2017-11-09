import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {UrlService} from '../../services/url.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'pagination',
    templateUrl: 'pagination.component.html'
})

export class PaginationComponent implements OnInit, OnDestroy, OnChanges {
    @Input() total: number;
    pager: any = {};
    perPageIntervals: Array<number> = [15, 30, 50, 100];
    perPage: number;
    page = this.urlService.queryParams['page'];
    s: Subscription;

    constructor(private urlService: UrlService) {}

    ngOnInit() {
        this.s = this.urlService.onUrlChange.subscribe(() => this.initPager());
        this.initPager();
    }

    ngOnChanges() {
        this.initPager();
    }

    ngOnDestroy() {
        this.s.unsubscribe();
    }

    initPager() {
        this.perPage = this.urlService.queryParams['per-page'];
        this.pager = this.getPager(this.total, +this.page, +this.perPage);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages || page === this.pager.currentPage) return;
        this.page = page;
        this.urlService.setQueryParams(null, this.page, this.perPage);
    }

    setQuantityPerPage(perPage: number) {
        if (this.perPage != perPage) {
            this.perPage = perPage;
            this.urlService.setQueryParams(null, 1, this.perPage);
        }
    }

    getPager(totalItems: number, currentPage: number = 1, pageSize: number = 4) {
        const totalPages = Math.ceil(totalItems / pageSize);
        const visiblePagesCount = 4;

        let startPage: number, endPage: number;
        if (totalPages <= visiblePagesCount) {
            // less than 4 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= Math.floor(visiblePagesCount / 2)) {
                startPage = 1;
                endPage = visiblePagesCount;
            } else if (currentPage + Math.floor(visiblePagesCount / 2) >= totalPages) {
                startPage = totalPages - visiblePagesCount;
                endPage = totalPages;
            } else {
                startPage = currentPage - Math.floor(visiblePagesCount / 2);
                endPage = currentPage + Math.floor(visiblePagesCount / 2);
            }
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        const pages: any[] = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
