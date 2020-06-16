import * as fromModel from '../models';

export const stateStoreKey = 'mirror';

export interface IStoreState {
    pageMetaData?: fromModel.IPageMetaData;
    scope?: { [key: string]: any };
    preview?: boolean;
};
