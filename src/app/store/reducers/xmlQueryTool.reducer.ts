import { XmlQueryToolActionTypes, xmlQueryToolAction } from '../actions/xmlQueryTool.actions';


export const programFeatureKey = 'xmlQueryTool';

export interface State {
  cognitoDetails: any;


}

export const initialState: State = {

  cognitoDetails: {},

};

export function reducer(state = initialState, action: xmlQueryToolAction): State {
  switch (action.type) {
    case XmlQueryToolActionTypes.StoreCognitoDetails:
      return { ...state, cognitoDetails: action.cognitoDetails }
    default:
      return state;
  }
}

export const getCognitoDetails = (state: State) => state.cognitoDetails;
