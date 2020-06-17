export interface IFilter {
    filterChange(data: { [key: string]: any }): Promise<void>;
}
