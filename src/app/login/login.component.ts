import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import * as AWS from 'aws-sdk/global';
import * as xmlQueryToolAction from '../store/actions/xmlQueryTool.actions';
import { Store } from '@ngrx/store';
import * as fromStore from '../store/reducers/index';
import {environment} from '../../environments/environment'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  provider;
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
  loading:boolean = false
  ngOnInit() {

  }
  login() {
    this.isInvalid = false;
    if ((this.password).indexOf("#") != -1) {
      this.password = (this.password).replace(/#/g, "%23");
    }
    if ((this.userName && this.userName.length) && (this.password && this.password.length)) {
      this.loading = true;
      this.cognitoAwsAmplify(this.userName,this.password);
    }
    else {
      this.errorMsg = 'Please Enter Username and Password'
      this.isInvalid = true
     }
  }
  cognitoAwsAmplify(userName,password){

    this.UserPoolId = 'us-east-1_nMzI8o7iu'
    this.ClientId = '5r283s0pt9cl41vc0v1mrj0bb2'
    this.regionId = 'us-east-1'
    this.IdentityPoolId = 'us-east-1:34dfed7e-1ec4-443c-bd23-c308aed829c0'
    this.provider ="cognito-idp."+this.regionId+".amazonaws.com/"+this.UserPoolId
    this.cognitoDetails = {
        userPoolId:this.UserPoolId,
        regionId:this.regionId,
        clientId:this.ClientId,
        identityPoolId:this.IdentityPoolId
            }
      this.store.dispatch(new xmlQueryToolAction.StoreCognitoDetails(this.cognitoDetails));
      var poolData = {
        UserPoolId:this.UserPoolId, // Your user pool id here
        ClientId: this.ClientId, // Your client id here
      };
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
              localStorage.setItem('uno', userName)
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
                    localStorage.clear()
                  }
                }, err => {
                  self.errorMsg = 'Failed to connect to a  service'
                  self.isInvalid = true
                  self.loading = false
                })
            }
          });
        },

        onFailure: (err)=> {
          self.loading = false
          console.log("data mismatch",err.message || JSON.stringify(err))
          this.errorMsg = err.message
          this.isInvalid = true
        },
        });
          }
        }
