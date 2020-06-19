import { InjectionToken } from '@angular/core';
import { IActionButton } from '../models/i-action-button';

export const ACTIONBUTTONMETADATA: InjectionToken<Array<IActionButton>> = new InjectionToken<Array<IActionButton>>('action button meta data');