export interface IComponentMetaData {
    key?: string;
    title?: string;
    control?: string;
    dataSourceKey?: string;
    containerId?: string;
    content?: Array<IComponentMetaData>;
}
