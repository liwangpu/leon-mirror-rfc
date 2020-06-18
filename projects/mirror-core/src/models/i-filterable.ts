export interface IFilter {
    filterParameters: { [key: string]: any };
    filterParameterChange(data: { [key: string]: any }): Promise<void>;
}
