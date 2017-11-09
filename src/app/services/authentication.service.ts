import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Router, CanActivate} from '@angular/router';
import {ApiClientService} from './api-client.service';

@Injectable()
export class AuthenticationService {

    public user;

    constructor(private api: ApiClientService) {
        this.initUser();
    }

    public login(email: string, password: string): Observable<boolean> {
        return this.api.getToken(email, password).map((token) => {
            if (token) {
                this.saveToken(token);
                this.getUser();
                return true;
            }
            return false;
        });
    }

    public logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userData');
        this.api.onLogout.emit();
    }

    public isAuthorized(): boolean {
        const token = sessionStorage.getItem('token');
        return !!token;
    }

    private saveToken(token: string): void {
        sessionStorage.setItem('token', token);
    }

    private getUser(): void {
        const url = `/api/users/me.json`;
        this.api.get('oauthUrl', url).subscribe(
            (res) => this.saveUser(res._body),
            (error) => console.error('Get user failed!', error)
        );
    }

    private saveUser(user: string): void {
        sessionStorage.setItem('userData', user);
        this.initUser();
    }

    private initUser() {
        const userData = sessionStorage.getItem('userData');
        try {
            if (userData) this.user = JSON.parse(userData);
        } catch (e) {
            console.error('Error get user from sessionStorage');
        }
    }

    isUserAdmin() {
        return this.user && this.user.userType === 'super_admin';
    }

}

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate() {
        if (sessionStorage.getItem('token')) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
