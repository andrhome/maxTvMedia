import {EventEmitter, Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ConstantsService} from './constants.service';

declare const toastr: any;
declare const $: any;

@Injectable()
export class ApiClientService {
    public onLogout = new EventEmitter();
    private options: RequestOptions;

    constructor(private http: Http) {
        const token = sessionStorage.getItem('token');

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        });

        this.options = new RequestOptions({headers: headers});
    }

    public getToken(email: string, password: string): Observable<string> {
        const url = `${ConstantsService.oauthUrl}/oauth/v2/token?grant_type=password` +
                     `&username=${email}&password=${password}` +
                     `&client_id=${ConstantsService.oauthClientId}` +
                     `&client_secret=${ConstantsService.oauthClientSecret}`;

        return this.http.get(url, this.options).map((response: Response) => response.json().access_token);
    }

    public get(domain: string, url: string): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        });

        this.options = new RequestOptions({headers: headers});
        return this.http.get(`${ConstantsService[domain]}${url}`, this.options);
    }

    public post(domain: string, url: string, body: Object): Observable<any> {
        return this.http.post(`${ConstantsService[domain]}${url}`, body, this.options)
            .map((response: Response) => response.json());
    }

    public patch(domain: string, url: string, body: Object): Observable<any> {
        return this.http.patch(`${ConstantsService[domain]}${url}`, body, this.options)
            .map((response: Response) => response.json());
    }

    public remove(domain: string, url: string): Observable<any> {
        return this.http.delete(`${ConstantsService[domain]}${url}`, this.options)
            .map((response: Response) => response.json());
    }

    private refreshToken() {}

    public errorHandler(error, msg: string) { 
        toastr.error(msg); console.error(error);
        const errorObj = JSON.parse(error._body);
        try {
            if (error.status === 500) toastr.error('Response status 500. <br> Internal Server Error.');
            if(
                errorObj.errors &&
                errorObj.errors[0].error == 'error.constraint.error.email.email_exists_for_building_and_suite'
            ){
                toastr.error('This email address belongs to another resident in this unit.');
                document.querySelector('input[name="email"]').classList.add('ng-invalid', 'ng-touched');
            }

            if (!errorObj.fields) return;
            
            for (const field in errorObj.fields) {
                if(errorObj.fields[field].errors) {
                    const errorDescription = errorObj.fields[field].errors[0].description;
                    $(`input[name="${field}"]`).addClass('ng-invalid ng-touched');
                    toastr.error(`${field}: ${errorDescription}`);
                }
            }
        } catch (e) {
            console.error('Invalid error handling!', e);
        }
    }

}
