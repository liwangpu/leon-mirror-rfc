export interface INotification {
    source: string;
    type: 'valueChange' | 'event';
    target?: string;
}
