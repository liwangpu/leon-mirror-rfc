import { ObjectTool } from '../utils';

export enum notificationType {
    valueChange = 'valueChange',
    resourceChange = 'resourceChange',
    event = 'event'
}

export interface INotification {
    source: string;
    type?: string;
    target?: any;
}

export function assignScopeByNotify(scope: {}, data: { [key: string]: any }, notify: INotification) {
    if (!scope || !data || !notify) { return; }
    let name = notify.target || notify.source;
    scope[name] = ObjectTool.recursionValueByField(data, notify.source);
}