import { IPageMetaData } from '../../models/i-page-meta-data';

export const mirrorFeatureKey = 'mirror';

export interface IMirrorState {
    pageMetaData?: IPageMetaData,
    previewMode?: boolean
}
