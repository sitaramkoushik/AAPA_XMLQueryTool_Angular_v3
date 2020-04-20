//https://stackoverflow.com/questions/45566944/angular-4-3-httpclient-intercept-response#
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

import {
  Router
} from '@angular/router';
import { signOut } from "../helpers"
let Cookies = require('js-cookie');

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Get the auth header from the service.
    var ClientId = localStorage.getItem('ClientId')
    let userName = localStorage.getItem('userName');
    let idToken = "CognitoIdentityServiceProvider."+ClientId+"."+userName+".idToken"
    console.log(idToken,"idToken is")
    let authHeader = localStorage.getItem(idToken) || '';
    console.log("authHeader",authHeader);
     //const authHeader = Cookies.get('xmlQueryToken') || ''
    // Clone the request to add the new header.
    let authReq:any

      authReq = req.clone({ headers: req.headers.set('Authorization', authHeader) });

    // Pass on the cloned request instead of the original request.
    return next.handle(authReq).pipe(map((event: HttpEvent<any>) => {
      // console.info('HttpResponse::event =', event, ';');
      // if (event instanceof HttpResponse && ~~(event.status / 100) > 3) {
      //   console.info('HttpResponse::event =', event, ';');
      // } else console.info('event =', event, ';');
      return event;
    }), timeout(15000), catchError((err) => {
      console.log(err, "errr-interceptor")
      // do something on a timeout
      return observableThrowError(err);
    })).pipe(catchError((err: any, caught) => {
      if (err instanceof HttpErrorResponse) {
        if (err.error.error && (err.error.error === 'Token Not Valid')) {
          console.log('logout user')
          signOut()
          // this.router.navigate(['/login']);
        }
      }
      return observableThrowError(err);
    }));
  }
}
