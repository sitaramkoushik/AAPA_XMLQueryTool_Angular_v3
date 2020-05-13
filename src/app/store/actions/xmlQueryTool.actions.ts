import { Action } from '@ngrx/store';

export enum XmlQueryToolActionTypes {
  StoreCognitoDetails = '[Program] Store Table Data',

}

export class StoreCognitoDetails implements Action {
  constructor(
    public cognitoDetails: any
  ) { }
  readonly type = XmlQueryToolActionTypes.StoreCognitoDetails;
}
export type xmlQueryToolAction = StoreCognitoDetails;



