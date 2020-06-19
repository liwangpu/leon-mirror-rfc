import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../state-store';
import * as fromModel from '../models';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class StateStoreService {

    public constructor(
        private store: Store<fromStore.IStoreState>
    ) { }

    public get pageMetaData$(): Observable<fromModel.IPageMetaData> {
        return this.store.select(fromStore.selectPageMetaData);
    }

    public get scopeData$(): Observable<{ [key: string]: any }> {
        return this.store.select(fromStore.selectScopeData);
    }

    public get previewMode$(): Observable<boolean> {
        return this.store.select(fromStore.selectPreviewMode);
    }

    public setPageMetaData(pageMetaData: fromModel.IPageMetaData): void {
        this.store.dispatch(fromStore.setPageMetaData({ pageMetaData }));
    }

    public setScopeData(scope: { [key: string]: any }, from?: string): void {
        this.store.dispatch(fromStore.setScopeData({ scope, from }));
    }

    public resetScopeData(from?: string): void {
        this.store.dispatch(fromStore.resetScopeData({ from }));
    }

    public resetPreviewMode(enable: boolean): void {
        this.store.dispatch(fromStore.setPreviewMode({ enable }));
    }

    public async getScopeDataSnapshot(): Promise<{ [key: string]: any }> {
        return this.scopeData$.pipe(take(1)).toPromise();
    }
}
