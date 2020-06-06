import { createAction, props } from '@ngrx/store';
import { IPageMetaData } from '../../models/i-page-meta-data';

export const updatePageMetaData = createAction('[mirror][pageMetaData] update',props<IPageMetaData>());