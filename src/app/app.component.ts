import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../app/store/reducers/index';
import * as xmlQueryToolAction from '../app/store/actions/xmlQueryTool.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  cognitoDetails: { userPoolId: any; regionId: any; clientId: any; identityPoolId: any; userName: any; password: any; };
  UserPoolId: string;
  ClientId: string;
  regionId: string;
  IdentityPoolId: string;
  userName: any;
  password: any;
  constructor(public store: Store<fromStore.State>) { }

  ngOnInit() {
    let env = localStorage.getItem("loggedInEnv")
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
    }
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
