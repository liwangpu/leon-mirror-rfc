import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromState from './state';

const selectStoreState = createFeatureSelector<fromState.IStoreState>(fromState.stateStoreKey);

export const selectPageMetaData = createSelector(
    selectStoreState,
    state => state.pageMetaData
);