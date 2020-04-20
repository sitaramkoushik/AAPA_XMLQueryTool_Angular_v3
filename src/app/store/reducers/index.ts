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
  tableData: fromXmlQueryTool.State,


}

export const reducers: ActionReducerMap<State> = {
  tableData: fromXmlQueryTool.reducer,

};

export const tableData = createFeatureSelector<fromXmlQueryTool.State>('tableData');
export const getTableData = createSelector(tableData, fromXmlQueryTool.getTableData);

export const metaReducers: MetaReducer<State>[] = [];
