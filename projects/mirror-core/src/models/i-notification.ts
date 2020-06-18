export enum notificationType {
    valueChange = 'valueChange',
    resourceChange = 'resourceChange',
    event = 'event'
}

export interface INotification {
    source: string;
    type?: notificationType;
    target?: any;
}
