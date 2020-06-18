import { INotification } from './i-notification';
import { IActionButton } from './i-action-button';

export interface IComponentMetaData {
    key?: string;
    title?: string;
    control?: string;
    dataSourceKey?: string;
    containerId?: string;
    content?: Array<IComponentMetaData>;
    notify?: Array<INotification>;
    subscribe?: Array<INotification>;
    filter?: { [key: string]: any };
    initialParameter?: { [key: string]: any };
    actions?: Array<IActionButton>;
}
