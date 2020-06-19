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
  cognitoDetails: { userPoolId: any; regionId: any; clientId: any; identityPoolId: any;  };
  UserPoolId: string;
  ClientId: string;
  regionId: string;
  IdentityPoolId: string;
  constructor(public store: Store<fromStore.State>) { }

  ngOnInit() {
      this.UserPoolId = 'us-east-1_nMzI8o7iu'
      this.ClientId = '5r283s0pt9cl41vc0v1mrj0bb2'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:34dfed7e-1ec4-443c-bd23-c308aed829c0'
      this.cognitoDetails = {
        userPoolId:this.UserPoolId,
        regionId:this.regionId,
        clientId:this.ClientId,
        identityPoolId:this.IdentityPoolId
                  }
      this.store.dispatch(new xmlQueryToolAction.StoreCognitoDetails(this.cognitoDetails));
}
}
