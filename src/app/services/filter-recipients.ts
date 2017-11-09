import {ResidentEmailRecipient} from '../types/email-data.types';
import {Group} from '../types/data.types';
import {EmailService} from './email.service';

export class FilterRecipients {
    residents: Array<ResidentEmailRecipient> = [];
    filters: Array<FilterRecipientsItem> = [];
    searchStr = '';
    showSelected = false;
    filterState: FilterStateItem[] = [];
    ignoreWaiverSettings = false;

    constructor(public es: EmailService) {
        this.filters = this.es.buildings.map(b => new FilterRecipientsItem(b.id, b.name, this.es.groups, this));
    }

    getFilterState(): FilterStateItem[] {
        const state = [];
        this.filters.forEach(f => {
            const checkedResidents = this.residents
                .filter(r => (r.checked && r.buildingId === f.buildingId))
                .map(r => r.id);
            if (!checkedResidents.length) return;
            state.push({
                buildingId: f.buildingId,
                buildingName: f.buildingName,

                tenantsChecked: f.tenantsChecked,
                tenantsHalfChecked: f.isHalfCheckedClass('rent'),
                tenantsCount: f.getUsersCheckedCount('rent'),

                ownerOnChecked: f.ownerOnChecked,
                ownerOnHalfChecked: f.isHalfCheckedClass('owner_on'),
                ownerOnCount: f.getUsersCheckedCount('owner_on'),

                ownerOffChecked: f.ownerOffChecked,
                ownerOffHalfChecked: f.isHalfCheckedClass('owner_off'),
                ownerOffCount: f.getUsersCheckedCount('owner_off'),

                notSetChecked: f.notSetChecked,
                notSetHalfChecked: f.isHalfCheckedClass('unknown'),
                notSetCount: f.getUsersCheckedCount('unknown'),

                groups: f.getGroupFilterState(),
                checkedResidents: checkedResidents
            });
        });
        return state;
    }

    resetFilterState(): void {
        this.filters.forEach((f: FilterRecipientsItem) => {
            f.tenantsChecked = f.ownerOnChecked = f.ownerOffChecked = f.notSetChecked = false;
        });
        this.residents.forEach(r => r.checked = false);
    }

    filterResidents(): ResidentEmailRecipient[] {
        function searchCondition(searchStr = '', resident: ResidentEmailRecipient) {
            searchStr = searchStr.toLowerCase();
            return !searchStr || (
                resident.fullName.toLowerCase().indexOf(searchStr) !== -1 ||
                resident.email.toLowerCase().indexOf(searchStr) !== -1 ||
                resident.buildingName.toLowerCase().indexOf(searchStr) !== -1 ||
                resident.suiteNumber.toLowerCase().indexOf(searchStr) !== -1
            );
        }

        function filterCondition(filter: FilterRecipientsItem, resident: ResidentEmailRecipient) {
            const showedGroups = filter.groups.filter(g => g.show);

            return (
                (filter.tenantsShow && resident.role === 'rent') ||
                (filter.ownerOnShow && resident.role === 'owner_on') ||
                (filter.ownerOffShow && resident.role === 'owner_off') ||
                (filter.notSetShow && resident.role === 'unknown') ||
                (
                    resident.groups.length && showedGroups.length &&
                    resident.groups.some(residentGroup => {
                        return showedGroups.some(showedGroup => showedGroup.name === residentGroup.itemName);
                    })
                )
            );
        }

        if (this.showSelected && this.isSomeChecked()) return this.residents.filter(r => r.checked);

        return this.residents.filter((resident: ResidentEmailRecipient) => {
            let condition = false;
            this.filters.forEach((filter: FilterRecipientsItem) => {
                if (
                    filter.buildingId === resident.buildingId &&
                    (resident.emailWaiverSigned || this.ignoreWaiverSettings) &&
                    searchCondition(this.searchStr, resident) &&
                    filterCondition(filter, resident)
                ) condition = true;
            });
            return condition;
        });
    }

    toggleCheckedAll(): void {
        const targetValue = !this.isCheckedAll();
        this.filterResidents().map(item => item.checked = targetValue);
    }

    uncheckedAllResidents(): void {
        this.residents.map(r => r.checked = false);
        this.uncheckedAllFilters();
    }

    uncheckedAllFilters(): void {
        this.filters.forEach(f => {
            f.tenantsShow = f.ownerOnShow = f.ownerOffShow = f.notSetShow = false;
            f.groups.map(g => g.show = false);
            f.tenantsChecked = f.ownerOnChecked = f.ownerOffChecked = f.notSetChecked = false;
            f.groups.map(g => g.checked = false);
        });
    }

    isCheckedAll(): boolean {
        return this.filterResidents().every(r => r.checked);
    }

    isSomeChecked(): boolean {
        return this.residents.some(r => r.checked);
    }

    selectedCount(): number {
        return this.residents.filter(r => r.checked).length;
    }

    getBuildingsContainCheckedUser(): number[] {
        return this.es.buildings.filter(b => {
            return this.residents.filter(r => r.buildingId === b.id).some(r => r.checked);
        }).map(b => +b.id);
    }

    updateCheckboxState() {
        this.filters.forEach(f => {
            const rInB = f.getResidentsInBuilding();
            f.tenantsChecked = rInB.some(r => (r.role === 'rent' && r.checked));
            f.ownerOnChecked = rInB.some(r => (r.role === 'owner_on' && r.checked));
            f.ownerOffChecked = rInB.some(r => (r.role === 'owner_off' && r.checked));
            f.notSetChecked = rInB.some(r => (r.role === 'unknown' && r.checked));
            f.groups.map(g => {
                g.checked = rInB.some(r => (
                    r.checked &&
                    r.groups.some(rg => g.name === rg.itemName)
                ));
            });
        });
    }
}

export interface FilterStateItem {
    buildingId: string;
    buildingName: string;
    tenantsChecked: boolean;
    tenantsHalfChecked: boolean;
    tenantsCount: number;
    ownerOnChecked: boolean;
    ownerOnHalfChecked: boolean;
    ownerOnCount: number;
    ownerOffChecked: boolean;
    ownerOffHalfChecked: boolean;
    ownerOffCount: number;
    notSetChecked: boolean;
    notSetHalfChecked: boolean;
    notSetCount: number;
    groups: [{ name: string, count: number, halfchecked: boolean }];
    checkedResidents: number[];
}

export class FilterRecipientsItem {
    parent: FilterRecipients;
    buildingId: string;
    buildingName: string;
    showDropdown = true;

    tenantsChecked = false;
    ownerOnChecked = false;
    ownerOffChecked = false;
    notSetChecked = false;

    tenantsShow = false;
    ownerOnShow = false;
    ownerOffShow = false;
    notSetShow = false;

    groups: { name: string, checked: boolean, show: boolean }[] = [];
    residentsLoaded = false;
    disabled = false;

    residentsWithoutEmail: Array<any> = [];

    constructor(buildingId: string,
                buildingName: string,
                groups: Group[],
                parent: FilterRecipients) {
        this.buildingId = buildingId;
        this.buildingName = buildingName;
        this.parent = parent;
        this.groups = groups.map(g => ({name: g.itemName, checked: false, show: false}));
    }

    getResidents(cb: Function): void {
        if (this.residentsLoaded) {
            cb();
            return;
        }
        this.parent.es.spinnerShow = true;
        this.disabled = true;
        const url = `/v1/suite-users.json?expand=user.groups.group,user.phones,suite&per-page=10000&suite_building=${this.buildingId}`;
        this.parent.es.api.get('domainBD', url).subscribe(res => {
                const entities = JSON.parse(res._body).entities;

                this.residentsWithoutEmail = [];
                entities.forEach((suiteUser) => {
                    if (!suiteUser.user) return;
                    const resident = suiteUser.user;

                    const r = new ResidentEmailRecipient();
                    r.id = resident.id;

                    if (resident && !resident.email) {
                        if (suiteUser.role) r.role = suiteUser.role;
                        if (suiteUser.building) r.buildingId = suiteUser.building;

                        this.residentsWithoutEmail.push(r);

                        return;
                    } else {
                        r.email = resident.email;
                    }
                    if (resident.fullName) r.fullName = resident.fullName;
                    if (suiteUser.role) r.role = suiteUser.role;
                    if (resident.emailWaiverSigned) r.emailWaiverSigned = !!resident.emailWaiverSigned;
                    if (resident.phones) r.phones = resident.phones;
                    if (suiteUser.suite) r.suiteId = suiteUser.suite.id;
                    if (suiteUser.suite) r.suiteNumber = suiteUser.suite.suiteNumber;
                    if (suiteUser.building) r.buildingId = suiteUser.building;
                    if (suiteUser.building) {
                        const b = this.parent.es.buildings.find(_b => _b.id == suiteUser.building);
                        r.buildingName = b.name;
                        r.buildingAddress = b.address;
                    }
                    r.groups = resident.groups.map(item => ({id: item.group.id, itemName: item.group.name}));

                    let isSet: boolean = !!this.parent.residents.find((item) => {
                        return item.id === r.id;
                    });

                    if (!isSet) {
                        this.parent.residents.push(r);
                    }
                });
                this.residentsLoaded = true;
                this.parent.es.spinnerShow = false;
                cb();
            }, error => this.parent.es.api.errorHandler(error, 'Failed get Residents'),
            () => this.disabled = false);
    }

    getResidentsInBuilding(): ResidentEmailRecipient[] {
        return this.parent.residents
            .filter(r => (
                (r.buildingId === this.buildingId) &&
                (r.emailWaiverSigned || this.parent.ignoreWaiverSettings)
            )) || [];
    }

    getUsersCount(role: string): number {
        return this.parent.residents.filter(r => (
            r.buildingId == this.buildingId && r.role === role &&
            (r.emailWaiverSigned || this.parent.ignoreWaiverSettings)
        )).length;
    }

    getUsersCountWithoutEmail(role: string): number {
        return this.residentsWithoutEmail.filter(item => {
            return item.buildingId == this.buildingId && item.role === role
        }).length;
    }

    getUsersCheckedCount(role: string): number {
        return this.parent.residents
            .filter(r => (
                    r.buildingId == this.buildingId &&
                    r.checked && r.role === role &&
                    (r.emailWaiverSigned || this.parent.ignoreWaiverSettings)
                )
            ).length;
    }

    getUserInGroupCount(groupName: string): number {
        return this.parent.residents.filter(r => {
            return (
                r.buildingId == this.buildingId &&
                r.groups.some(group => group.itemName === groupName) &&
                (r.emailWaiverSigned || this.parent.ignoreWaiverSettings)
            );
        }).length;
    }

    getUserCheckedInGroupCount(groupName: string): number {
        return this.parent.residents.filter(r => {
            return (
                r.buildingId == this.buildingId &&
                r.checked &&
                r.groups.some(group => group.itemName === groupName) &&
                (r.emailWaiverSigned || this.parent.ignoreWaiverSettings)
            );
        }).length;
    }

    isSomeCheckboxChecked(): boolean {
        return (
            this.tenantsChecked ||
            this.ownerOnChecked ||
            this.ownerOffChecked ||
            this.notSetChecked ||
            this.groups.some(g => g.checked)
        );
    }

    isAllCheckboxChecked(): boolean {
        return (
            this.tenantsChecked &&
            this.ownerOnChecked &&
            this.ownerOffChecked &&
            this.notSetChecked &&
            this.groups.every(g => g.checked)
        );
    }

    getGroupFilterState() {
        const result = [];
        this.groups.filter(g => g.checked).forEach(g => {
            const gObj = {
                name: g.name,
                count: this.getUserCheckedInGroupCount(g.name),
                halfchecked: this.isHalfCheckedClass('group', g.name)
            };
            result.push(gObj);
        });
        return result;
    }

    toggleTargetList(target: string, group?: string) {
        this.getResidents(() => {
            this.tenantsShow = this.ownerOnShow = this.ownerOffShow = this.notSetShow = false;
            this.groups.map(g => g.show = false);

            if (target === 'all') {
                this.tenantsShow = this.ownerOnShow = this.ownerOffShow = this.notSetShow = true;
                this.groups.map(g => g.show = true);

            } else if (target === 'residents') {
                this.tenantsShow = this.ownerOnShow = true;

            } else if (target === 'group') {
                this.groups.find(g => g.name === group).show = true;

            } else {
                this[target] = true;
            }
        });
    }

    unselectTargetList(target: string, group?: string) {
        this.getResidents(() => {
            this.tenantsShow = this.ownerOnShow = this.ownerOffShow = this.notSetShow = false;
            this.groups.map(g => g.show = false);

            if (target === 'all') {
                this.tenantsShow = this.ownerOnShow = this.ownerOffShow = this.notSetShow = false;
                this.groups.map(g => g.show = false);

            } else if (target === 'residents') {
                this.tenantsShow = this.ownerOnShow = false;

            } else if (target === 'group') {
                this.groups.find(g => g.name === group).show = false;

            } else {
                this[target] = false;
            }
        });
    }

    isAllInBuildingShow() {
        return (
            this.tenantsShow &&
            this.ownerOnShow &&
            this.ownerOffShow &&
            this.notSetShow &&
            this.groups.every(g => g.show)
        );
    }

    checkedTargetResidents(target: string, state: boolean, targetGroupName?: string) {
        this.getResidents(() => {
            let targetResident;

            if (target === 'all') {
                targetResident = this.getResidentsInBuilding();
                this.tenantsChecked = this.ownerOnChecked = this.ownerOffChecked = this.notSetChecked = state;
                this.groups.map(g => g.checked = state);

            } else if (target === 'residents') {
                this.tenantsChecked = this.ownerOnChecked = state;
                targetResident = this.getResidentsInBuilding()
                    .filter(r => (r.role === 'rent' || r.role === 'owner_on'));

            } else if (target === 'group') {
                targetResident = this.getResidentsInBuilding()
                    .filter(r => r.groups.some(g => targetGroupName === g.itemName));

            } else {
                targetResident = this.getResidentsInBuilding().filter(r => r.role === target);
            }

            if (targetResident) targetResident.map(g => g.checked = state);
        });
    }

    isHalfCheckedClass(target: string, targetGroupName?: string): boolean {
        let targetResident;

        if (target === 'all') {
            targetResident = this.getResidentsInBuilding();

        } else if (target === 'residents') {
            targetResident = this.getResidentsInBuilding()
                .filter(r => (r.role === 'rent' || r.role === 'owner_on'));

        } else if (target === 'group') {
            targetResident = this.getResidentsInBuilding()
                .filter(r => r.groups.some(g => targetGroupName === g.itemName));

        } else {
            targetResident = this.getResidentsInBuilding().filter(r => r.role === target);
        }

        const checkedResidents = targetResident.filter(r => r.checked);

        return (checkedResidents.length && targetResident.length !== checkedResidents.length);
    }

}
