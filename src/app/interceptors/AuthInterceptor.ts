//https://stackoverflow.com/questions/45566944/angular-4-3-httpclient-intercept-response#
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpUserEvent
} from '@angular/common/http';

import { refreshTokens,decrypt } from "../helpers";
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import {  catchError, map, timeout, delay } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { secretKey } from "../table/data";

import {
  Router
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '../store/reducers/index';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  cognitoDetails: any;
  constructor(private router: Router,public store: Store<fromStore.State>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    //Get the auth header from the service.
    this.store.select(fromStore.getCognitoDetails).subscribe((res) => {
			if(res){
				this.cognitoDetails = res;
			}
		})

    let authHeader = ''
    let idToken
       if(!req.url.includes("amazonaws.com")){
        let userName =decrypt(localStorage.getItem('uno'));
         idToken = "CognitoIdentityServiceProvider."+this.cognitoDetails.clientId+"."+userName+".idToken"
        authHeader = (localStorage.getItem(idToken))!=null?localStorage.getItem(idToken):'' ;
    if(authHeader!=null){
      let kid
      let refresh = false
      try {
        kid = JSON.parse(atob(authHeader.split('.')[0])).kid;
      } catch (error) {
        console.log(error)
        refresh = true
      }
      if(refresh){
        refreshTokens(this.cognitoDetails);
      }else {
        var expTime = JSON.parse(atob(authHeader.split('.')[1])).exp;
        var expDate = new Date(((expTime*1000)-(2*60*1000)));
        var curDate = new Date();
        console.log(expDate,curDate)
        if(curDate>expDate){
          console.log("token expired")
          refreshTokens(this.cognitoDetails);
        }else {
          console.log("token valid")
        }
      }
  }
   req = req.clone({ headers: req.headers.set('Authorization', authHeader) });
 }
    // Clone the request to add the new header.
      return next.handle(req).pipe(catchError(err => {
        console.log(err);
        if (err.status === 401) {
              authHeader = localStorage.getItem(idToken);
              req = req.clone({ headers: req.headers.set('Authorization', authHeader) });
              return next.handle(req).pipe(catchError(error => {
                console.log(error,"error iss")
                        return observableThrowError(error);
              }));
        }
        return observableThrowError(err);
    }));
  }
}
