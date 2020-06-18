import { INotification } from './i-notification';

export interface ISubscribe {
    subscribe: Array<INotification>;
    onNotify(notify: INotification): Promise<void>;
}
