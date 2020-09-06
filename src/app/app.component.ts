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
      this.UserPoolId = 'us-east-1_WPhcg35bJ'
      this.ClientId = '65arl0n1r50mhlfbevgrd1c7qu'
      this.regionId = 'us-east-1'
      this.IdentityPoolId = 'us-east-1:e22a23c9-0f34-42fd-ad6f-a548649f8c06'
      this.cognitoDetails = {
        userPoolId:this.UserPoolId,
        regionId:this.regionId,
        clientId:this.ClientId,
        identityPoolId:this.IdentityPoolId
                  }
      this.store.dispatch(new xmlQueryToolAction.StoreCognitoDetails(this.cognitoDetails));
}
}
