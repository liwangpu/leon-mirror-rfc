export interface IDataSource {
    dataSourceKey: string;
    onResourceChange(ids?: Array<string>): Promise<void>;
    createResource(): Promise<string>;
    updateResource(): Promise<void>;
    deleteResource(): Promise<void>;
}
