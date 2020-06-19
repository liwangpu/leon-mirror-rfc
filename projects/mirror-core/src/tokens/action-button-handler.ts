import { InjectionToken } from '@angular/core';
import { IActionButton } from '../models/i-action-button';

export interface IActionButtonHandler {
    onClick(button: IActionButton): Promise<void>;
}

export const ACTIONBUTTONHANDLER: InjectionToken<IActionButtonHandler> = new InjectionToken<IActionButtonHandler>('action button handler');