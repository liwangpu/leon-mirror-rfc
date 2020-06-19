export interface IDataSource {
    dataSourceKey: string;
    onResourceChange(ids?: Array<string>): Promise<void>;
    createResource(entity: { [key: string]: any }): Promise<string>;
    updateResource(entity: { id: string, [key: string]: any }): Promise<void>;
    deleteResource(id: string): Promise<void>;
}
