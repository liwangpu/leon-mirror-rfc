import { InjectionToken } from '@angular/core';
import { IComponentMetaData } from '../models/i-component-meta-data';

export const COMPONENTMETADATA: InjectionToken<IComponentMetaData> = new InjectionToken<IComponentMetaData>('component design data');