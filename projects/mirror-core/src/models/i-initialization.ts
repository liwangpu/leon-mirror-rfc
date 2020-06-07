export interface IInitialization {
    parameters: { [key: string]: any };
    initialize(data: { [key: string]: any }): Promise<void>;
}
