import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let Cookies = require('js-cookie');
import { Router } from "@angular/router";
import urls from "../routes/urls";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) { }

  signedIn = false;
  isInvalid = false;
  errorMsg = ''
  userName = '';
  password = '';

  login() {
    this.isInvalid = false;
    if ((this.password).indexOf("#") != -1) {
      this.password = (this.password).replace(/#/g, "%23");
    }

    if ((this.userName && this.userName.length) && (this.password && this.password.length)) {

      this.http.post(urls.loginUrl, {userName:this.userName,password:this.password})
        .subscribe(data => {
          if (data && data['statusCode']=='200') {
            Cookies.set('xmlQueryToken', data['jwtToken']);
            this.router.navigate(['']);

            localStorage.setItem('userName', this.userName)
          }
          else{
            console.log(data['message'],"else----errrrrrrrrr")
            this.errorMsg = data['message'];
            this.isInvalid = true
          }
        }, err => {
          console.log(err,"errrrrrrrrr")
          this.errorMsg = 'Failed to connect to a  service'
          this.isInvalid = true
        })
    } else {
      this.errorMsg = 'Please Enter Username and Password'
      this.isInvalid = true
    }
  }
}
