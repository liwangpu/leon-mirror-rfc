export interface IActionButton {
    title: string;
    type: string;
    target?: string;
    parameters?: { [key: string]: any };
}
