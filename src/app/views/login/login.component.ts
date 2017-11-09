import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {CustomStyleService} from '../../services/custom-style.service';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
    email = '';
    password = '';

    isError = false;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        public cs: CustomStyleService
    ) {}

    submit() {
        this.authService.login(this.email, this.password)
            .subscribe(
                (isLogin) => {
                    if (isLogin) this.router.navigateByUrl('/home');
                    else this.isError = true;
                },
                (error) => this.isError = true
            );
    }

    resetError() {
        this.isError = false;
    }

    ngOnInit() {
        if (this.authService.isAuthorized()) {
            this.router.navigateByUrl('/home');
        }
    }

    ngAfterViewInit() {
        document.body.classList.add('gray-bg');
    }

    ngOnDestroy() {
        document.body.classList.remove('gray-bg');
    }
}
