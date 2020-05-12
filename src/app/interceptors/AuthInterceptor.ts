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

import { refreshTokens,cognitoAwsAmplify } from "../helpers";
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import {  catchError, map, timeout, delay } from 'rxjs/operators';


import {
  Router
} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    //Get the auth header from the service.
    var ClientId = localStorage.getItem('ClientId')
    let userName = localStorage.getItem('userName');
    let password = localStorage.getItem('password');
    var IdentityPoolId = localStorage.getItem('IdentityPoolId')
    var UserPoolId = localStorage.getItem('UserPoolId')
    var regionId = localStorage.getItem('regionId')
    let authHeader = ''
    let idToken = "CognitoIdentityServiceProvider."+ClientId+"."+userName+".idToken"
    authHeader = (localStorage.getItem(idToken))!=null?localStorage.getItem(idToken):'' ;
       if(!req.url.includes("userLogin")){
      // if(authHeader==null && ClientId && userName && IdentityPoolId && UserPoolId && regionId && password ){
      //   cognitoAwsAmplify(userName,password,regionId,IdentityPoolId,UserPoolId,ClientId)
      // }else if(authHeader &&( !ClientId || !userName || !IdentityPoolId || !UserPoolId || !regionId || !password)){
      //   this.router.navigate(['/login']);
      // }
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
        refreshTokens();
      }else {
        var expTime = JSON.parse(atob(authHeader.split('.')[1])).exp;
        var expDate = new Date(((expTime*1000)-(2*60*1000)));
        var curDate = new Date();
        console.log(expDate,curDate)
        if(curDate>expDate){
          console.log("token expired")
          refreshTokens();
        }else {
          console.log("token valid")
        }
      }
  }
   req = req.clone({ headers: req.headers.set('Authorization', authHeader) });
 }
     //const authHeader = Cookies.get('xmlQueryToken') || ''
    // Clone the request to add the new header.
      return next.handle(req).pipe(catchError(err => {
        console.log(err);
        if (err.status === 401) {
          //if (err.error.message == "The incoming token has expired") {
              authHeader = localStorage.getItem(idToken);
              req = req.clone({ headers: req.headers.set('Authorization', authHeader) });
              return next.handle(req).pipe(catchError(error => {
                console.log(error,"error iss")
                //let interval = setInterval(()=>{
                 // authHeader = localStorage.getItem(idToken);
                  //  clearInterval(interval);
                    // req = req.clone({ headers: req.headers.set('Authorization', authHeader) });
                    // return next.handle(req).pipe(delay(5000),catchError(e=>{
                    //   return observableThrowError(error);
                    // }));
              //  },1000)

                        return observableThrowError(error);
              }));

          // }else {
          //   //Logout from account or do some other stuff
          // }
        }
        return observableThrowError(err);
    }));
  }
}
