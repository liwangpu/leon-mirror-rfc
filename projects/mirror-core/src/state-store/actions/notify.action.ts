import { createAction, props } from '@ngrx/store';

export const valueChange = createAction('[mirror][valueChange]', props<{ name: string; value: any }>());