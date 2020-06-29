import { Injectable } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';
import * as fromModel from '../models';
import { Observable, of } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';
import * as fromState from './state';
import * as fromSelector from './selector';
import * as fromAction from './action';
import * as fromUtils from '../utils';
import * as _ from 'lodash';

@Injectable()
export class StateStoreService {

    public constructor(
        private store: Store<fromState.IStoreState>
    ) { }

    public get pageMetaData$(): Observable<fromModel.IPageMetaData> {
        return this.store.select(fromSelector.selectPageMetaData);
    }

    public get scopeData$(): Observable<{ [key: string]: any }> {
        return this.store.select(fromSelector.selectScopeData);
    }

    public get previewMode$(): Observable<boolean> {
        return this.store.select(fromSelector.selectPreviewMode);
    }

    public setPageMetaData(pageMetaData: fromModel.IPageMetaData): void {
        this.store.dispatch(fromAction.setPageMetaData({ pageMetaData }));
    }

    public setScopeData(key: string, scope: { [key: string]: any }): void {
        this.store.dispatch(fromAction.setScopeData({ key, scope }));
    }

    public resetScopeData(from?: string): void {
        this.store.dispatch(fromAction.resetScopeData({ from }));
    }

    public resetPreviewMode(enable: boolean): void {
        this.store.dispatch(fromAction.setPreviewMode({ enable }));
    }

    public setComponentMetaData(key: string, metaData: fromModel.IComponentMetaData): void {
        this.store.dispatch(fromAction.setComponentMetaData({ key, metaData }));
    }

    public notifyWhenExpressionChange(expression: {} | string): Observable<any> {
        let variables = fromUtils.ExpressionTranslator.analyzeExpressionVariable(expression);
        if (!variables.length) { return of(expression); }

        const VARIABLES_NOT_READY: string = 'variable-not-ready'
        let dySelector = createSelector(
            fromSelector.selectStoreState,
            state => {
                if (!state.scope) { return VARIABLES_NOT_READY; }
                if (!variables.every(v => _.has(state.scope, v))) { return VARIABLES_NOT_READY; }
                let data = fromUtils.ExpressionTranslator.translateStaticVariableExpression(expression, state.scope);
                return JSON.stringify(data);
            }
        );
        return this.store.select(dySelector).pipe(filter(str => str !== VARIABLES_NOT_READY)).pipe(map(str => JSON.parse(str)));

    }

    public async getScopeDataSnapshot(): Promise<{ [key: string]: any }> {
        return this.scopeData$.pipe(take(1)).toPromise();
    }

}
