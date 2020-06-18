export interface IInitialize {
    initialParameter: { [key: string]: any };
    InitialParameterChange(data: { [key: string]: any }): Promise<void>;
}
