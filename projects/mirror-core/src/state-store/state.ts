import * as fromModel from '../models';

export const stateStoreKey = 'mirror';

export interface IStoreState {
    pageMetaData?: fromModel.IPageMetaData;
    componentMetaData?: { [key: string]: fromModel.IComponentMetaData };
    scope?: { [key: string]: any };
    preview?: boolean;
};
