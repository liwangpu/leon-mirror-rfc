export interface IInitializable {
    initialParameters: { [key: string]: any };
    InitialParameterChange(data: { [key: string]: any }): Promise<void>;
}
