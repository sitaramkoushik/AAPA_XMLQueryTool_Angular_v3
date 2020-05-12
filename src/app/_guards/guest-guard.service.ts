import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';
let Cookies = require('js-cookie');
// import { AuthService } from './auth.service';

@Injectable()
export class GuestGuard implements CanActivate, CanActivateChild {
    constructor(
        // private authService: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return !(this.checkLogin(url));
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string): boolean {
      //  let cookie = Cookies.get('xmlQueryToken');
      var ClientId = localStorage.getItem('ClientId')
    let userName = localStorage.getItem('userName');
    let idToken = "CognitoIdentityServiceProvider."+ClientId+"."+userName+".idToken"
    let authHeader = localStorage.getItem(idToken);
        if (authHeader!=null) {
            this.router.navigate(['/']);
            return true
        }
        return false
    }
}
