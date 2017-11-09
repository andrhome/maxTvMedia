import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ApiDirectoryItemService} from '../../../services/api-directory.service';
import {HistoryItem} from './history-item.class';

@Component({
    templateUrl: 'activity.template.html',
    providers: [ApiDirectoryItemService]
})
export class ItemActivityComponent implements OnInit, OnDestroy {
    sub: Subscription;
    suiteId: number;
    activities: HistoryItem[] = [];
    activitiesParcels: HistoryItem[] = [];
    isActivitiesDirectoryEmpty = false;
    isActivitiesParcelsEmpty = false;
    activeTab = 'directory';

    constructor(private route: ActivatedRoute, private api: ApiDirectoryItemService) {}

    ngOnInit() {
        this.activeTab = this.route.snapshot.url[1].path;
        this.sub = this.route.parent.params.subscribe(params => {
            this.suiteId = +params['id'];
            if      (this.activeTab === 'directory')         this.getActivity();
            else if (this.activeTab === 'parcels') this.getActivityParcels();
        });
    }

    getActivity(): void {
        this.api.getActivityBySuiteId(this.suiteId).subscribe(
            res => {
                if (!res.map) { this.isActivitiesDirectoryEmpty = true; return;}
                this.activities = res.map(a => new HistoryItem(a));
            }
        );

    }

    getActivityParcels() {
        this.api.getActivityBySuiteId(this.suiteId, 'domainParcels').subscribe(
            res => {
                if (!res.map) { this.isActivitiesParcelsEmpty = true; return; }
                this.activitiesParcels = res.map(a => new HistoryItem(a));
            }
        );
    }

    targetActivities(): HistoryItem[] {
        if (     this.activeTab === 'directory')         return this.activities;
        else if (this.activeTab === 'parcels') return this.activitiesParcels;
        else { console.error('Wrong value activeTab');  return []; }
    }

    isSpinnerShow() {
        return !((this.isActivitiesDirectoryEmpty || this.isActivitiesParcelsEmpty) || this.targetActivities().length);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
