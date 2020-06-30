import { IComponentMetaData } from './i-component-meta-data';
import { INotification } from './i-notification';

export interface INotify {
    content: Array<IComponentMetaData>;
    publishScopeData(data: { [key: string]: any }, action: string): void;
    publishNotify(notify: INotification): void;
}
