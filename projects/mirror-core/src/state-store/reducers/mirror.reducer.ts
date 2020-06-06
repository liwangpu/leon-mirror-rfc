import { createReducer, on } from '@ngrx/store';
import { updatePageMetaData } from '../actions/meta-data.action';
import { IMirrorState } from '../states/i-mirror-state';
import { IPageMetaData } from '../../models/i-page-meta-data';
import { openPreviewMode, closePreviewMode } from '../actions/design.action';

const _mirrorReducer = createReducer({},
    on(updatePageMetaData, (state: IMirrorState, action: IPageMetaData) => {
        return { ...state, pageMetaData: { ...action } };
    }),
    on(openPreviewMode, (state: IMirrorState) => {
        return { ...state, previewMode: true };
    }),
    on(closePreviewMode, (state: IMirrorState) => {
        return { ...state, previewMode: false };
    })
);

export function mirrorReducer(state, action) {
    return _mirrorReducer(state, action);
}