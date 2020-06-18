export interface IFilter {
    filterParameter: { [key: string]: any };
    filterParameterChange(data: { [key: string]: any }): Promise<void>;
}
