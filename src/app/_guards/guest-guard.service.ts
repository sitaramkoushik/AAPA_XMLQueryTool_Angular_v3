import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '../store/reducers/index';

@Injectable()
export class GuestGuard implements CanActivate, CanActivateChild {
    cognitoDetails: any;
    constructor(
        // private authService: AuthService,
        private router: Router,public store: Store<fromStore.State>) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return !(this.checkLogin(url));
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string): boolean {
    if(localStorage.getItem("HQUserLoggedIn")== "true"){
        this.router.navigate(['/']);
        return true;
    }
        return false
    }
}
