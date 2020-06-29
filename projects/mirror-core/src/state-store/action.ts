import { createAction, props } from '@ngrx/store';
import * as fromModel from '../models';

export const setPageMetaData = createAction('[mirror] set page meta data', props<{ pageMetaData: fromModel.IPageMetaData }>());
export const setScopeData = createAction('[mirror] set scope data', props<{ scope: { [key: string]: any }, key: string }>());
export const resetScopeData = createAction('[mirror] reset scope data', props<{ from?: string }>());
export const setPreviewMode = createAction('[mirror] set preview mode', props<{ enable: boolean }>());
export const setComponentMetaData = createAction('[mirror] set component meta data', props<{ key: string, metaData: fromModel.IComponentMetaData }>());