import {Component, HostListener, Input, OnInit} from '@angular/core';
import {UrlService} from '../../services/url.service';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    @Input() tabHeading: string;
    @Input() buildings = [];
    searchDelay: any;
    searchString = '';
    showDropdown = false;
    selectedBuilding: string;

    constructor(
        private urlService: UrlService
    ) {}

    ngOnInit() {
        this.searchString     = this.urlService.queryParams.query || '';
        this.selectedBuilding = this.urlService.queryParams.building || '';
    }

    search(): void {
        this.urlService.queryParams.query = this.searchString;
        this.urlService.setQueryParams(null, 1);
    }

    searchOnInput(): void {
        clearTimeout(this.searchDelay);
        this.searchDelay = setTimeout(() => this.search(), 500);
    }

    clearSearch(): void {
        this.urlService.queryParams.query = this.searchString = null;
        this.urlService.setQueryParams();
    }

    filterByBuilding(buildingId: string) {
        this.selectedBuilding     = buildingId;
        this.urlService.queryParams.building = buildingId;
        this.urlService.setQueryParams(null, 1);
    }

    getBuildingName(id: string) {
        const building = this.buildings.find(b => b.id == id);
        return building ? building.name : 'All Buildings';
    }

    @HostListener('document:click', ['$event.target'])
    hideDropdown(targetElement: HTMLElement): void {
        if (!targetElement.closest('.building-filter-col')) this.showDropdown = false;
    }

}
