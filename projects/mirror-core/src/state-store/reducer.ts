import { createReducer, on } from '@ngrx/store';
import * as fromAction from './action';
import * as fromState from './state';

export const stateReducer = createReducer({},
    on(fromAction.setPageMetaData, (state: fromState.IStoreState, { pageMetaData }) => {
        return { ...state, pageMetaData };
    }),
    on(fromAction.setScopeData, (state: fromState.IStoreState, { scope }) => {
        return { ...state, scope: { ...state.scope, ...scope } };
    }),
    on(fromAction.resetScopeData, (state: fromState.IStoreState) => {
        return { ...state, scope: {} };
    }),
    on(fromAction.setPreviewMode, (state: fromState.IStoreState, { enable }) => {
        return { ...state, preview: enable };
    })
);