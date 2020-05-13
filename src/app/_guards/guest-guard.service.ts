import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '../store/reducers/index';
import { decrypt } from "../helpers";
let Cookies = require('js-cookie');
// import { AuthService } from './auth.service';

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
      this.store.select(fromStore.getCognitoDetails).subscribe((res) => {
        if(res){
            this.cognitoDetails = res;
        }
    })
      let authHeader =null
        if(localStorage.getItem("uno")!=null){
    let userName =decrypt(localStorage.getItem('uno'));
    let idToken = "CognitoIdentityServiceProvider."+this.cognitoDetails.clientId+"."+userName+".idToken"
     authHeader = localStorage.getItem(idToken);
        }
        if (authHeader!=null) {
            this.router.navigate(['/']);
            return true
        }
        return false
    }
}
