import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IMirrorState } from '../states/i-mirror-state';

export const selectMirror = (state: any) => state.mirror;

export const selectPageMetaData = createSelector(
    selectMirror,
    (state: IMirrorState) => state.pageMetaData
);

export const selectPreviewMode = createSelector(
    selectMirror,
    (state: IMirrorState) => state.previewMode
);