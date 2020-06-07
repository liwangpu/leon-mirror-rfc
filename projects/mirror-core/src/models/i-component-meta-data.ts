import { INotification } from './i-notification';

export interface IComponentMetaData {
    key?: string;
    title?: string;
    control?: string;
    dataSourceKey?: string;
    containerId?: string;
    content?: Array<IComponentMetaData>;
    notify?: Array<INotification>;
}
