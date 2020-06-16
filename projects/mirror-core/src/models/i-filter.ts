export interface IFilter {
    filter: { [key: string]: any };
    filterChange(filter: { [key: string]: any }): Promise<void>;
}
