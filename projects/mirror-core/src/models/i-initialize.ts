export interface IInitialize {
    initialParameters: { [key: string]: any };
    InitialParameterChange(data: { [key: string]: any }): Promise<void>;
}
