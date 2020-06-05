import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
let Cookies = require('js-cookie');
import { Router } from "@angular/router";
// import AWS object without services
import * as AWS from 'aws-sdk/global';
import * as xmlQueryToolAction from '../store/actions/xmlQueryTool.actions';
import { Store } from '@ngrx/store';
import * as fromStore from '../store/reducers/index';
import {environment} from '../../environments/environment'
import { secretKey } from "../table/data";
import * as CryptoJS from 'crypto-js';
declare var window: any

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  @Output() tablesData: EventEmitter<any> = new EventEmitter();
  @Output() disableButtons: EventEmitter<any> = new EventEmitter();
  @Output() dataMessage: EventEmitter<any> = new EventEmitter();

  provider;
  isSignOut: boolean = false;
  cognitoUser: any;


  constructor(private http: HttpClient, private router: Router,public store: Store<fromStore.State>) { }
  isInvalid:boolean = false;
  errorMsg = ''
  userName = '';
  password = '';
  UserPoolId:any = ''
  ClientId = ''
  regionId = ''
  IdentityPoolId = ''
  cognitoDetails={}
  env = '';
  successOrFailure:boolean;
  loading:boolean = false
  ngOnInit() {

  }
  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, secretKey.trim()).toString();
  }


     getEnvProps(env){
    if(env == "DEV") {
      this.UserPoolId = 'us-east-1_q38uYDTHa'
      this.ClientId = '3dn006e20aft7s75ijam0bmsuf'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:6a44e2cf-b89e-4ad0-abaa-49dba53f8dd0'
    }else if ( env == "STAGING") {
      this.UserPoolId = 'us-east-1_EG7QRM8Ej'
      this.ClientId = '2f5d4qjvsmqu9cgroea9mokgia'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:53807951-c2ed-45bf-a71e-9ea521b6afe8'
    } else if (env == "PROD") {
      this.UserPoolId = 'us-east-1_nMzI8o7iu'
      this.ClientId = '5r283s0pt9cl41vc0v1mrj0bb2'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:34dfed7e-1ec4-443c-bd23-c308aed829c0'
    } else {
      this.UserPoolId = 'us-east-1_nMzI8o7iu'
      this.ClientId = '5r283s0pt9cl41vc0v1mrj0bb2'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:34dfed7e-1ec4-443c-bd23-c308aed829c0'
    }
    localStorage.setItem("loggedInEnv",env);
    this.provider ="cognito-idp."+this.regionId+".amazonaws.com/"+this.UserPoolId
     this.cognitoDetails = {
      userPoolId:this.UserPoolId,
      regionId:this.regionId,
      clientId:this.ClientId,
      identityPoolId:this.IdentityPoolId,
      userName:this.userName,
      password:this.password
    }
   		 this.store.dispatch(new xmlQueryToolAction.StoreCognitoDetails(this.cognitoDetails));
  }
  login() {
    this.isInvalid = false;
    if ((this.password).indexOf("#") != -1) {
      this.password = (this.password).replace(/#/g, "%23");
    }

    if ((this.userName && this.userName.length) && (this.password && this.password.length)) {
      this.loading = true;
      // this.getEnvProps(this.env);
      this.cognitoAwsAmplify("PROD","https://ms.myplace4parts.com/prod/xmlQueryTool",this.userName,this.password,true,[]);

    }
    else {
      this.errorMsg = 'Please Enter Username and Password'
      this.isInvalid = true
     }
  }
  cognitoAwsAmplify(env,baseurl,userName,password,isLogin,queryObj:{}){


    if(env == "DEV") {
      this.UserPoolId = 'us-east-1_q38uYDTHa'
      this.ClientId = '3dn006e20aft7s75ijam0bmsuf'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:6a44e2cf-b89e-4ad0-abaa-49dba53f8dd0'
    }else if ( env == "STAGING") {
      this.UserPoolId = 'us-east-1_EG7QRM8Ej'
      this.ClientId = '2f5d4qjvsmqu9cgroea9mokgia'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:53807951-c2ed-45bf-a71e-9ea521b6afe8'
    } else if (env == "PROD") {
      this.UserPoolId = 'us-east-1_nMzI8o7iu'
      this.ClientId = '5r283s0pt9cl41vc0v1mrj0bb2'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:34dfed7e-1ec4-443c-bd23-c308aed829c0'
    } else {
      this.UserPoolId = 'us-east-1_nMzI8o7iu'
      this.ClientId = '5r283s0pt9cl41vc0v1mrj0bb2'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:34dfed7e-1ec4-443c-bd23-c308aed829c0'
    }
    localStorage.setItem("loggedInEnv",env);
    this.provider ="cognito-idp."+this.regionId+".amazonaws.com/"+this.UserPoolId
    var poolData = {
      UserPoolId:this.UserPoolId, // Your user pool id here
      ClientId: this.ClientId, // Your client id here
    };
    var completed = false
    var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var userData = {
      Username: userName,
      Pool: userPool,
    };

     this.cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

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
  AWS.config.region = self.regionId;
  var logins={providerName:"cognito-idp."+self.regionId+".amazonaws.com/"+self.UserPoolId}
  var awsConfig = {
    IdentityPoolId: self.IdentityPoolId,
    Logins:{}
  }
  awsConfig.Logins[logins['providerName']]=result.getIdToken().getJwtToken()
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(awsConfig);
  //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
//		AWS.config.credentials.refresh(error => {
( < AWS.CognitoIdentityCredentials > AWS.config.credentials).refresh((error) => {

    if (error) {
      console.error(error,"ERRRORROROROROROR",result);
    } else {
      console.log('Successfully logged!');
      localStorage.setItem('uno', self.encrypt(userName))
      localStorage.setItem('unokey', self.encrypt(password))
      if(isLogin){
        self.http.post(environment.login, {userName:self.userName,password:self.password} )
       .subscribe(data => {
         if (data && data['statusCode']=='200' && data['isHqUser']==true) {
          self.loading = false;
          localStorage.setItem("HQUserLoggedIn","true");
          self.router.navigate(['']);
            }
          else{
            self.errorMsg = (data['isHqUser']==true)?data['message']:"Not a hq user";
            self.isInvalid = true
            self.loading = false

          }
        }, err => {
          self.errorMsg = 'Failed to connect to a  service'
          self.isInvalid = true
          self.loading = false
        })

      }else{
        self.http.get(baseurl + '/advSearch', queryObj).subscribe(res => {
          if (!res || !res['data']) {
            alert('Something wrong')
            return
          }
          self.tablesData.emit(res);
          self.disableButtons.emit(false);
        })
        self.loading = false;
        self.router.navigate(['']);
      }

    }
  });
},

//	onFailure: function(err) {
onFailure: (err)=> {
  self.loading = false
  console.log("data mismatch",err.message || JSON.stringify(err))
  self.dataMessage.emit({"message":err.message,"isLoading":false,"disablebuttons":false})
  self.disableButtons.emit(false);
  this.errorMsg = err.message
   this.isInvalid = true
},
});
this.cognitoDetails = {
  userPoolId:this.UserPoolId,
  regionId:this.regionId,
  clientId:this.ClientId,
  identityPoolId:this.IdentityPoolId,
  userName:this.userName,
  password:this.password
}
    this.store.dispatch(new xmlQueryToolAction.StoreCognitoDetails(this.cognitoDetails));
  }
}
