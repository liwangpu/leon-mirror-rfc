import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromState from './state';

export const selectStoreState = createFeatureSelector<fromState.IStoreState>(fromState.stateStoreKey);

export const selectPageMetaData = createSelector(
    selectStoreState,
    state => state.pageMetaData
);

export const selectPreviewMode = createSelector(
    selectStoreState,
    state => state.preview
);

export const selectScopeData = createSelector(
    selectStoreState,
    state => state.scope
);