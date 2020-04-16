import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
let Cookies = require('js-cookie');
import { Router } from "@angular/router";
import urls from "../routes/urls";
// import AWS object without services
import * as AWS from 'aws-sdk/global';
import {environment} from '../../environments/environment'
import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
} from 'amazon-cognito-identity-js';
declare var window: any
//   "replace": "src/environments/environment.ts",
// "with": "src/environments/environment.prod.ts"

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  provider;
  isSignOut: boolean = false;
  cognitoUser: any;


  constructor(private http: HttpClient, private router: Router) { }
  isInvalid:boolean = false;
  errorMsg = ''
  userName = '';
  password = '';
  UserPoolId = ''
  ClientId = ''
  regionId = ''
  IdentityPoolId = ''
  env = '';
  ngOnInit() {
    this.getEnvProps(this.env);
  }
    getEnvProps(env){
    const location = window.location.href
    console.log("location iss",location);
    if( location == "DEV" || env == "DEV") {
      console.log("dev")
      this.UserPoolId = 'us-east-1_q38uYDTHa'
      this.ClientId = '3dn006e20aft7s75ijam0bmsuf'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:6a44e2cf-b89e-4ad0-abaa-49dba53f8dd0'
    }else if (location == "STAGING" || env == "STAGING") {
      console.log("staging")
      this.UserPoolId = 'us-east-1_EG7QRM8Ej'
      this.ClientId = '2f5d4qjvsmqu9cgroea9mokgia'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:53807951-c2ed-45bf-a71e-9ea521b6afe8'
    } else if (location == "PROD" || env == "PROD") {
      console.log("prod")
      this.UserPoolId = 'us-east-1_nMzI8o7iu'
      this.ClientId = '5r283s0pt9cl41vc0v1mrj0bb2'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:34dfed7e-1ec4-443c-bd23-c308aed829c0'
    } else {
      console.log("staging else")
      this.UserPoolId = 'us-east-1_nMzI8o7iu'
      this.ClientId = '5r283s0pt9cl41vc0v1mrj0bb2'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:34dfed7e-1ec4-443c-bd23-c308aed829c0'
    }
    localStorage.setItem('UserPoolId', this.UserPoolId)
    localStorage.setItem('ClientId', this.ClientId)
    this.provider ="cognito-idp."+this.regionId+".amazonaws.com/"+this.UserPoolId

  }
  login() {
    this.isInvalid = false;
    if ((this.password).indexOf("#") != -1) {
      this.password = (this.password).replace(/#/g, "%23");
    }

    if ((this.userName && this.userName.length) && (this.password && this.password.length)) {
      const formData: FormData = new FormData();
      formData.append('screen-name', this.userName);
      formData.append('password', this.password);
      let parameters = new HttpParams()
			.set('screen-name', this.userName)
      .set('password', this.password);
      let loginURL  = environment.login+'/screen-name/'+this.userName+'/password/'+this.password
      this.getEnvProps(this.env);
     // let header = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : configs.tokenValue});
      this.http.get(loginURL)
       .subscribe(data => {
         if (data && data['statusCode']=='200') {

         this.cognitoAwsAmplify(false,this.userName,this.password,this.regionId,this.IdentityPoolId,this.UserPoolId,this.ClientId);

            }
          else{
            this.errorMsg = data['message'];
            this.isInvalid = true
          }
        }, err => {
          this.errorMsg = 'Failed to connect to a  service'
          this.isInvalid = true
        })
    } else {
      this.errorMsg = 'Please Enter Username and Password'
      this.isInvalid = true
     }
  }
  cognitoAwsAmplify(isSignedIn,userName,password,regionId,identityPoolId,UserPoolId,ClientId){

    var poolData = {
      UserPoolId:UserPoolId, // Your user pool id here
      ClientId: ClientId, // Your client id here
    };
    var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    console.log("userpool is",userPool);

    var userData = {
      Username: userName,
      Pool: userPool,
    };

     this.cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    console.log(userName,password);
console.log("cognitoUser",this.cognitoUser);
var authenticationData = {
Username: userName,
Password: password,
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
authenticationData
);
var self = this
this.cognitoUser.authenticateUser(authenticationDetails, {
onSuccess: function(result) {
  //POTENTIAL: Region needs to be set if not already set previously elsewhere.
  AWS.config.region = regionId;
  var logins={providerName:"cognito-idp."+regionId+".amazonaws.com/"+UserPoolId}
  var awsConfig = {
    IdentityPoolId: identityPoolId,
    Logins:{}
  }
  awsConfig.Logins[logins['providerName']]=result.getIdToken().getJwtToken()
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(awsConfig);
  //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
//		AWS.config.credentials.refresh(error => {
( < AWS.CognitoIdentityCredentials > AWS.config.credentials).refresh((error) => {

    if (error) {
      console.error(error);
    } else {
      // Instantiate aws sdk service objects now that the credentials have been updated.
      // example: var s3 = new AWS.S3();
      console.log('Successfully logged!');
    }
  });
  Cookies.set('xmlQueryToken',result.getIdToken().getJwtToken());

  console.log(userName,"usrname");
  self.router.navigate(['']);

  ///Cookies.set('xmlQueryToken',result.getIdToken().getJwtToken());
  localStorage.setItem('userName', userName)
  localStorage.setItem('password', password)//is this correct way?

  console.log("after route")
},

//	onFailure: function(err) {
onFailure: (err)=> {
  console.log("data mismatch",err.message || JSON.stringify(err))
  this.errorMsg = err.message
   this.isInvalid = true
},
});
  }
}
