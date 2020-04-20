import { XmlQueryToolActionTypes, xmlQueryToolAction } from '../actions/xmlQueryTool.actions';


export const programFeatureKey = 'xmlQueryTool';

export interface State {
  tableData: any;


}

export const initialState: State = {

  tableData: {},

};

export function reducer(state = initialState, action: xmlQueryToolAction): State {
  switch (action.type) {
    case XmlQueryToolActionTypes.StoreTableData:
      return { ...state, tableData: action.tableData }
    default:
      return state;
  }
}

export const getTableData = (state: State) => state.tableData;
