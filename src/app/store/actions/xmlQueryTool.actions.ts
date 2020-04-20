import { Action } from '@ngrx/store';

export enum XmlQueryToolActionTypes {
  StoreTableData = '[Program] Store Table Data',

}

export class StoreTableData implements Action {
  constructor(
    public tableData: any
  ) { }
  readonly type = XmlQueryToolActionTypes.StoreTableData;
}
export type xmlQueryToolAction = StoreTableData;



