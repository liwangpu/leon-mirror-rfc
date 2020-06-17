export interface IInitializable {
    InitialParameterChange(data: { [key: string]: any }): Promise<void>;
}
