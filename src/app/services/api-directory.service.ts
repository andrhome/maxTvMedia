import {Injectable} from '@angular/core';
import {ApiClientService} from './api-client.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DirectoryItemComponent} from '../views/directory-item/directory-item.component';

declare const toastr: any;

@Injectable()
export abstract class ApiService {

    constructor(public api: ApiClientService,
                public route: ActivatedRoute,
                public router: Router) {
    }

    abstract getItems(suiteId: number): Observable<any>;

    abstract getItemId(parent: DirectoryItemComponent): Observable<number>;

    abstract getItem(id: number): Observable<any>;

    abstract updateItem(id: number, data: any): Observable<any>;

    abstract deleteItem(id: number): Observable<any>;

    abstract updateView(parent: DirectoryItemComponent, isRedirect: boolean): void;

    protected prepareItemId(urlKey: string, listKey: string, parent: DirectoryItemComponent): Observable<number> {
        return this.route.params.map((params: Params) => {
            const id = parseInt(params['id']);

            if (!id) {
                if (parent[listKey].length) {
                    this.router.navigateByUrl('/directory/item/' + parent.suiteId + `/${urlKey}/` + parent[listKey][0].id);
                } else {
                    this.getItems(parent.suiteId).subscribe((res) => {
                        if (res.entities.length) {
                            parent[listKey] = res.entities;

                            const id = res.entities[0].id;
                            this.router.navigateByUrl('/directory/item/' + parent.suiteId + `/${urlKey}/` + id);
                        }
                    });
                }
            } else {
                if (!parent[listKey].length) {
                    this.getItems(parent.suiteId).subscribe((res) => {
                        if (res.entities.length) {
                            parent[listKey] = res.entities;
                        }
                    });
                }

                return id;
            }
        });
    }

    protected updateParentList(suiteId: number, listKey: string, parent: DirectoryItemComponent): Observable<any> {
        parent[listKey] = [];

        return this.getItems(suiteId).map((res) => {
            if (res.entities.length) {
                parent[listKey] = res.entities;
            }
        });
    }

}

@Injectable()
export class ApiResidentService extends ApiService {

    constructor(public api: ApiClientService,
                public route: ActivatedRoute,
                public router: Router) {
        super(api, route, router);
    }

    getItems(suiteId: number): Observable<any> {
        const url = `/v1/residents?suite_id=${suiteId}&expand=suiteUser`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Residents'));
    }

    getItemId(parent: DirectoryItemComponent): Observable<number> {
        return this.prepareItemId('residents', 'residentsList', parent);
    }

    getItem(id: number): Observable<any> {
        const url = `/v1/residents/${id}?expand=phones,addresses,groups.group,suiteUser`;

        return this.api.get('domainBD', url).map(data => JSON.parse(data._body));
    }

    updateItem(id: number, data: any): Observable<any> {
        const url = `/v1/suite-users/${id}`;
        const body = this.prepareData(data);

        return this.api.patch('domainBD', url, body).map((res) => {
            toastr.success('Resident was updated!');

            return res;
        });
    }

    prepareData(data: any): any {
        const result: any = {
            user: {},
        };

        if (data.groups) {
            result.user.groups = data.groups.map( g => ({ group: +g.id}) );
        }

        if (data.phones) {
            result.user.phones = [];
            data.phones.forEach((phone) => {
                if (phone.phone) {
                    result.user.phones.push({
                        isPrimaryPhone: +phone.isPrimaryPhone,
                        phone: phone.phone,
                        phoneType: phone.phoneType,
                        user: phone.user
                    });
                }
            });
        }

        if (data.addresses) {
            result.user.addresses = [];
            data.addresses.forEach((address) => {
                if (address.address) {
                    result.user.addresses.push({
                        address: address.address,
                        city: address.city,
                        country: address.country,
                        isPrimaryAddress: +address.isPrimaryAddress,
                        postalCode: address.postalCode,
                        state: address.state,
                        user: address.user
                    });
                }
            });
        }

        createValueIsSet('email');
        createValueIsSet('fullName');
        createValueIsSet('dateOfBirth');
        createValueIsSet('emergencyContact');
        createValueIsSet('emergencyAssistantNotes');
        createValueIsSet('emailWaiverSigned');
        createValueIsSet('parcelWaiverSigned');
        createValueIsSet('keyWaiverSigned');

        if (data.role) {
            result.role = data.role;
        }
        return result;

        function createValueIsSet(key) {
            result.user[key] = data[key];
        }
    }

    deleteItem(id: number): Observable<any> {
        const url = `/v1/suite-users/${id}`;

        return this.api.remove('domainBD', url).map((res) => {
            toastr.success('Resident has been moved out.');

            return res;
        }, (error) => this.api.errorHandler(error, 'Moved out resident failed'));
    }

    updateView(parent: DirectoryItemComponent, isRedirect: boolean = true): void {
        if (!parent.residentsList.length) {
            isRedirect = true;
        }

        this.updateParentList(parent.suiteId, 'residentsList', parent).subscribe(() => {
            if (isRedirect) {
                const url = `/directory/item/${parent.suiteId}/residents`;
                const isCurrentUrl = this.router.url === url;

                if (isCurrentUrl) this.getItemId(parent).subscribe();
                else this.router.navigate([url]);
            }
        });
    }

}

@Injectable()
export class ApiLockersService extends ApiService {

    constructor(public api: ApiClientService,
                public route: ActivatedRoute,
                public router: Router) {
        super(api, route, router);
    }

    getItems(suiteId: number): Observable<any> {
        const url = `/v1/locker?suite=${suiteId}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Residents'));
    }

    getItemId(parent: DirectoryItemComponent): Observable<number> {
        return this.prepareItemId('lockers', 'lockersList', parent);
    }

    getItem(id: number) {
        const url = `/v1/locker/${id}`;

        return this.api.get('domainBD', url).map(data => JSON.parse(data._body));
    }

    updateItem(id: number, data: any) {
        const url = `/v1/locker/${id}`;

        return this.api.patch('domainBD', url, this.prepareData(data)).map((res) => {
            toastr.success('Locker was updated!');

            return res;
        });
    }

    prepareData(data: any): any {
        const result: any = {};

        createValueIsSet('lockerKeyCode');
        createValueIsSet('legalDescription');
        createValueIsSet('rentedOut');
        createValueIsSet('rentedTo');
        createValueIsSet('note');

        return result;

        function createValueIsSet(key) {
            result[key] = data[key];
        }
    }

    deleteItem(id: number): Observable<any> {
        const url = `/v1/locker/${id}`;
        return this.api.remove('domainBD', url).map((res) => {
            toastr.success('Locker was removed!');

            return res;
        }, (error) => this.api.errorHandler(error, 'Delete Locker failed'));
    }

    updateView(parent: DirectoryItemComponent, isRedirect: boolean = true): void {
        if (!parent.lockersList.length) {
            isRedirect = true;
        }

        this.updateParentList(parent.suiteId, 'lockersList', parent).subscribe(() => {
            if (isRedirect) {
                const url = `/directory/item/${parent.suiteId}/lockers`;
                const isCurrentUrl = this.router.url === url;

                if (isCurrentUrl) {
                    this.getItemId(parent).subscribe();
                } else {
                    this.router.navigate([url]);
                }
            }
        });
    }

}

@Injectable()
export class ApiParkingSpotsService extends ApiService {

    constructor(public api: ApiClientService,
                public route: ActivatedRoute,
                public router: Router) {
        super(api, route, router);
    }

    getItems(suiteId: number): Observable<any> {
        const url = `/v1/parking?suite=${suiteId}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Parking'));
    }

    getItemId(parent: DirectoryItemComponent): Observable<number> {
        return this.prepareItemId('parking-spots', 'parkingList', parent);
    }

    getItem(id: number) {
        const url = `/v1/parking/${id}?expand=suite,building`;

        return this.api.get('domainBD', url).map(data => JSON.parse(data._body));
    }

    updateItem(id: number, data: any) {
        const url = `/v1/parking/${id}`;

        return this.api.patch('domainBD', url, this.prepareData(data)).map((res) => {
            toastr.success('Parking Spot was updated!');

            return res;
        });
    }

    prepareData(data: any): any {
        const result: any = {};

        createValueIsSet('parkingNumber');
        createValueIsSet('rentedOut');
        createValueIsSet('rentedTo');
        createValueIsSet('garageRemote');
        createValueIsSet('handicap');
        createValueIsSet('legalDescription');
        createValueIsSet('note');

        return result;

        function createValueIsSet(key) {
            result[key] = data[key];
        }
    }

    deleteItem(id: number): Observable<any> {
        const url = `/v1/parking/${id}`;
        return this.api.remove('domainBD', url).map((res) => {
            toastr.success('Parking Spot was removed!');

            return res;
        }, (error) => this.api.errorHandler(error, 'Delete Parking Spot failed'));
    }

    updateView(parent: DirectoryItemComponent, isRedirect: boolean = true): void {
        if (!parent.parkingList.length) {
            isRedirect = true;
        }

        this.updateParentList(parent.suiteId, 'parkingList', parent).subscribe(() => {
            if (isRedirect) {
                const url = `/directory/item/${parent.suiteId}/parking-spots`;
                const isCurrentUrl = this.router.url === url;

                if (isCurrentUrl) this.getItemId(parent).subscribe();
                else this.router.navigate([url]);
            }
        });
    }

}

@Injectable()
export class ApiVehiclesService extends ApiService {

    constructor(public api: ApiClientService,
                public route: ActivatedRoute,
                public router: Router) {
        super(api, route, router);
    }

    getItems(suiteId: number): Observable<any> {
        const url = `/v1/vehicle?suite_id=${suiteId}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Vehicle'));
    }

    getItemId(parent: DirectoryItemComponent): Observable<number> {
        return this.prepareItemId('vehicles', 'vehicleList', parent);
    }

    getItem(id: number) {
        const url = `/v1/vehicle/${id}?expand=owner.suiteUser`;

        return this.api.get('domainBD', url).map(data => JSON.parse(data._body));
    }

    updateItem(id: number, data: any) {
        const url = `/v1/vehicle/${id}`;

        const body = this.prepareData(data);

        return this.api.patch('domainBD', url, body).map((res) => {
            toastr.success('Vehicle was updated!');

            return res;
        });
    }

    prepareData(data: any): any {
        const result: any = {};

        if (data.owner) {
            if (Number.isInteger(data.owner)) {
                result['owner'] = data.owner;
            } else {
                result['ownerName'] = data.owner;
            }
        }

        createValueIsSet('brand');
        createValueIsSet('licensePlate');
        createValueIsSet('model');
        createValueIsSet('note');
        createValueIsSet('ownerName');
        createValueIsSet('year');
        createValueIsSet('color');

        return result;

        function createValueIsSet(key) {
            result[key] = data[key];
        }
    }

    deleteItem(id: number): Observable<any> {
        const url = `/v1/vehicle/${id}`;
        return this.api.remove('domainBD', url).map((res) => {
            toastr.success('Vehicle was removed!');

            return res;
        }, (error) => this.api.errorHandler(error, 'Delete Vehicle failed'));
    }

    public getOwners(suiteId: number): Observable<any> {
        const url = `/v1/residents?suite_id=${suiteId}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Owners'));
    }

    updateView(parent: DirectoryItemComponent, isRedirect: boolean = true): void {
        if (!parent.vehicleList.length) {
            isRedirect = true;
        }

        this.updateParentList(parent.suiteId, 'vehicleList', parent).subscribe(() => {
            if (isRedirect) {
                const url = `/directory/item/${parent.suiteId}/vehicles`;
                const isCurrentUrl = this.router.url === url;

                if (isCurrentUrl) this.getItemId(parent).subscribe();
                else this.router.navigate([url]);
            }
        });
    }

}

@Injectable()
export class ApiPetsItemService extends ApiService {

    constructor(public api: ApiClientService,
                public route: ActivatedRoute,
                public router: Router) {
        super(api, route, router);
    }

    getItems(suiteId: number): Observable<any> {
        const url = `/v1/pet?suite=${suiteId}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Suite'));
    }

    getItemId(parent: DirectoryItemComponent): Observable<number> {
        return this.prepareItemId('pets', 'petsList', parent);
    }

    getItem(id: number): Observable<any> {
        const url = `/v1/pet/${id}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Suite'));
    }

    updateItem(id: number, data: any) {
        const url = `/v1/pet/${id}`;

        const body = this.prepareData(data);

        return this.api.patch('domainBD', url, body).map((res) => {
            toastr.success('Pet was updated!');

            return res;
        });
    }

    prepareData(data: any): any {
        const result: any = {};

        createValueIsSet('name');
        createValueIsSet('petType');
        createValueIsSet('weight');
        createValueIsSet('height');
        createValueIsSet('dateOfBirth');
        createValueIsSet('breed');
        createValueIsSet('note');

        return result;

        function createValueIsSet(key) {
            result[key] = data[key];
        }
    }

    deleteItem(id: number): Observable<any> {
        const url = `/v1/pet/${id}`;
        return this.api.remove('domainBD', url).map((res) => {
            toastr.success('Pet was removed!');

            return res;
        }, (error) => this.api.errorHandler(error, 'Delete Pet failed'));
    }

    public getPetTypes(): Observable<any> {
        const url = `/v1/pet_type.json?per-page=1000&order-by=name|asc`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Suite'));
    }

    updateView(parent: DirectoryItemComponent, isRedirect: boolean = true): void {
        if (!parent.petsList.length) {
            isRedirect = true;
        }

        this.updateParentList(parent.suiteId, 'petsList', parent).subscribe(() => {
            if (isRedirect) {
                const url = `/directory/item/${parent.suiteId}/pets`;
                const isCurrentUrl = this.router.url === url;

                if (isCurrentUrl) this.getItemId(parent).subscribe();
                else this.router.navigate([url]);
            }
        });
    }

}

@Injectable()
export class ApiBikeRacksService extends ApiService {

    constructor(public api: ApiClientService,
                public route: ActivatedRoute,
                public router: Router) {
        super(api, route, router);
    }

    getItems(suiteId: number): Observable<any> {
        const url = `/v1/bike_rack?suite=${suiteId}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Suite'));
    }

    getItemId(parent: DirectoryItemComponent): Observable<number> {
        return this.prepareItemId('bike-racks', 'bikeRacksList', parent);
    }

    getItem(id: number): Observable<any> {
        const url = `/v1/bike_rack/${id}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Suite'));
    }

    updateItem(id: number, data: any) {
        const url = `/v1/bike_rack/${id}`;

        const body = this.prepareData(data);

        return this.api.patch('domainBD', url, body).map((res) => {
            toastr.success('Bike Rack was updated!');

            return res;
        });
    }

    prepareData(data: any): any {
        const result: any = {};

        createValueIsSet('rackNumber');
        createValueIsSet('rentedOut');
        createValueIsSet('rentedTo');
        createValueIsSet('note');

        return result;

        function createValueIsSet(key) {
            result[key] = data[key];
        }
    }

    deleteItem(id: number): Observable<any> {
        const url = `/v1/bike_rack/${id}`;
        return this.api.remove('domainBD', url).map((res) => {
            toastr.success('Bike rack was removed!');

            return res;
        }, (error) => this.api.errorHandler(error, 'Delete Bike rack failed'));
    }

    updateView(parent: DirectoryItemComponent, isRedirect: boolean = true): void {
        if (!parent.bikeRacksList.length) {
            isRedirect = true;
        }

        this.updateParentList(parent.suiteId, 'bikeRacksList', parent).subscribe(() => {
            if (isRedirect) {
                const url = `/directory/item/${parent.suiteId}/bike-racks`;
                const isCurrentUrl = this.router.url === url;

                if (isCurrentUrl) this.getItemId(parent).subscribe();
                else this.router.navigate([url]);
            }
        });
    }

}

@Injectable()
export class ApiInfoService extends ApiService {

    constructor(public api: ApiClientService,
                public route: ActivatedRoute,
                public router: Router) {
        super(api, route, router);
    }

    getItems(suiteId: number): Observable<any> {
        return;
    }

    getItemId(parent: DirectoryItemComponent): Observable<number> {
        return;
    }

    getItem(id: number): Observable<any> {
        const url = `/v1/suites/${id}`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Suite'));
    }

    updateItem(id: number, data: any): Observable<any> {
        const url = `/v1/suites/${id}`;

        const body = this.prepareData(data);
        return this.api.patch('domainBD', url, body).map((res) => {
            toastr.success('Unit info was updated!');

            return res;
        });
    }

    prepareData(data: any): any {
        const result: any = {};

        createValueIsSet('emergencyContact');
        createValueIsSet('proportionateShare');
        createValueIsSet('occupancyDate');
        createValueIsSet('buzz');
        createValueIsSet('keyCode');
        createValueIsSet('keyFob');
        createValueIsSet('powerAttorney');
        createValueIsSet('legalDescription');
        createValueIsSet('rentedOut');
        createValueIsSet('note');
        createValueIsSet('allowedVisitor');

        return result;

        function createValueIsSet(key) {
            result[key] = data[key];
        }
    }

    deleteItem(id: number): Observable<any> {
        return undefined;
    }

    updateView(parent, isRedirect): void {}

}

@Injectable()
export class ApiDirectoryItemService {

    constructor(private api: ApiClientService) {
    }

    public getSuite(suiteId): Observable<any> {
        const url = `/v1/suites/${suiteId}?expand=building`;

        return this.api.get('domainBD', url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get Suite'));
    }

    public getActivityBySuiteId(suiteId, serviceDomain = 'domainBD'): Observable<any> {
        const url = `/v1/history?suite=${suiteId}&order-by=loggedAt|desc&per-page=500`;

        return this.api.get(serviceDomain, url).map(res => JSON.parse(res._body),
            (error) => this.api.errorHandler(error, 'Failed get history'));
    }

}
