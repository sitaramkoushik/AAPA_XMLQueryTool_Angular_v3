import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';

import * as fromXmlQueryTool from './xmlQueryTool.reducer';

// tslint:disable-next-line:no-empty-interface
export interface State {
  cognitoDetails: fromXmlQueryTool.State,


}

export const reducers: ActionReducerMap<State> = {
  cognitoDetails: fromXmlQueryTool.reducer,

};

export const cognitoDetails = createFeatureSelector<fromXmlQueryTool.State>('cognitoDetails');
export const getCognitoDetails = createSelector(cognitoDetails, fromXmlQueryTool.getCognitoDetails);

export const metaReducers: MetaReducer<State>[] = [];
