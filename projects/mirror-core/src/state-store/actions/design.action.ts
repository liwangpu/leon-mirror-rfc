import { createAction, props } from '@ngrx/store';

export const openPreviewMode = createAction('[mirror][preview] open');
export const closePreviewMode = createAction('[mirror][preview] close');