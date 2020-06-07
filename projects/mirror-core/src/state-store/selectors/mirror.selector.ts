import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IMirrorState, mirrorFeatureKey } from '../states/i-mirror-state';

export const selectMirror = createFeatureSelector(mirrorFeatureKey);

export const selectPageMetaData = createSelector(
    selectMirror,
    (state: IMirrorState) => state.pageMetaData
);

export const selectPreviewMode = createSelector(
    selectMirror,
    (state: IMirrorState) => state.previewMode
);

export const selectValueScope = createSelector(
    selectMirror,
    (state: IMirrorState) => state.valueScope
);

export const selectValueScopeVariables = createSelector(
    selectValueScope,
    (scope) => {
        if (!scope) { return []; }
        return Object.keys(scope);
    }
);

export const selectValueScopeAndVariables = createSelector(
    selectValueScope,
    selectValueScopeVariables,
    (scope, variables) => ({ scope, variables })
);