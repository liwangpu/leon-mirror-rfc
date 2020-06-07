export interface IFilter {
    readonly filter: { [key: string]: any };
    filterChange(filter: { [key: string]: any }): Promise<void>;
}
