import {ActivityDictionary} from './activity.dictionary';
import {DatePipe} from '@angular/common';

export class HistoryItem {
    loggedAt: string;
    userFullName: string;
    action: string;
    activityType: string;
    originActivityType: string;
    name: string;
    extra;
    data: { 'key': string, 'value': string }[] |
        { 'key': string, 'new': string, 'old': string }[] = [];

    static translate(str: string): string {
        return ActivityDictionary.getValue(str);
    }

    constructor(a) {
        this.loggedAt           = a.loggedAt;
        this.userFullName       = a.userFullName;
        this.activityType       = HistoryItem.translate(a.activityType);
        this.originActivityType = a.activityType;
        this.name               = a.name;
        this.extra              = a.extra;

        const keys = Object.keys(a.data);

        if (keys.length === 0 || (keys.length === 1 && keys[0] === 'extra')) {
            this.action = 'ignore';

        } else if (a.action == 'remove' && a.activityType == 'suite_user') {
            this.action = 'remove_suite_user';
            this.data = Object.keys(a.data).map((key) => {
                return {
                    key: HistoryItem.translate(key),
                    value: this.checkAtDateOrTranslate(a.data[key])
                };
            });

        } else if (a.action === 'update' && a.activityType === 'resident_phone') {
            const isPr = a.data.isPrimaryPhone;
            if (     isPr && isPr.new === 'yes' && isPr.old === 'no')  this.action = 'change_primary';
            else if (isPr && isPr.new === 'no'  && isPr.old === 'yes') this.action = 'ignore';
            else this.defaultUpdate(a, 'change_phone');

        } else if (a.action === 'update' && a.activityType === 'resident_address') {
            const isPr = a.data.isPrimaryAddress;
            if (     isPr && isPr.new === 'yes' && isPr.old === 'no')  this.action = 'change_primary';
            else if (isPr && isPr.new === 'no'  && isPr.old === 'yes') this.action = 'ignore';
            else this.defaultUpdate(a, 'change_address');

        } else if (a.action === 'update') {
            this.defaultUpdate(a);

        } else {
            this.action = a.action;
            this.data = Object.keys(a.data).map((key) => {
                return {
                    key: HistoryItem.translate(key),
                    value: this.checkAtDateOrTranslate(a.data[key])
                };
            });
        }
    }

    defaultUpdate(a, action = 'update') {
        this.action = action;
        this.data = Object.keys(a.data).map((key) => {
            return {
                'key': HistoryItem.translate(key),
                'new': this.checkAtDateOrTranslate(a.data[key].new),
                'old': this.checkAtDateOrTranslate(a.data[key].old)
            };
        });
    }

    checkAtDateOrTranslate(value: string) {
        if (/\d\d\d\d-\d\d-\d\d/.test(value)) return (new DatePipe('en-US')).transform(value, 'dd.MM.yyyy');
        else return HistoryItem.translate(value);
    }

}
