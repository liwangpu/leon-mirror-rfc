export interface IActionButton {
    title: string;
    type: string;
    target?: string;
    parameter?: { [key: string]: any };
}
