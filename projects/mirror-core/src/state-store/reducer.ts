import { createReducer, on } from '@ngrx/store';
import * as fromAction from './action';
import * as fromState from './state';

function getScopeData(state: fromState.IStoreState, key: string): { [key: string]: any } {
    return { ...state.scope[key] };
}

function updateScopeData(state: fromState.IStoreState, scope: {}, key: string, action?: string): { [key: string]: any } {
    let componentScopeData = getScopeData(state, key);
    return { ...componentScopeData, [action]: scope };
}

export const stateReducer = createReducer({},
    on(fromAction.setPageMetaData, (state: fromState.IStoreState, { pageMetaData }) => {
        return { ...state, pageMetaData };
    }),
    on(fromAction.setScopeData, (state: fromState.IStoreState, { key, action, scope }) => {
        if (!key) {
            return { ...state, scope: { ...state.scope, ...scope } };
        }
        return { ...state, scope: { ...state.scope, [key]: updateScopeData(state, scope, key, action) } };
    }),
    on(fromAction.resetScopeData, (state: fromState.IStoreState) => {
        return { ...state, scope: {} };
    }),
    on(fromAction.setPreviewMode, (state: fromState.IStoreState, { enable }) => {
        return { ...state, preview: enable };
    }),
    on(fromAction.setComponentMetaData, (state: fromState.IStoreState, { key, metaData }) => {
        return { ...state, componentMetaData: { ...state.componentMetaData, [key]: metaData } };
    })
);