import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { valueChange } from '../state-store/actions/notify.action';

@Injectable()
export class ValueChangeEffectService {

    public constructor(
        private actions$: Actions
    ) { }

    // @Effect({ dispatch: false })
    // public valueChange$ = this.actions$.pipe(ofType(valueChange))
}
