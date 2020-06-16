import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../state-store';
import * as fromModel from '../models';
import { Observable } from 'rxjs';

@Injectable()
export class StateStoreService {

    public constructor(
        private store: Store<fromStore.IStoreState>
    ) { }

    public get pageMetaData$(): Observable<fromModel.IPageMetaData> {
        return this.store.select(fromStore.selectPageMetaData);
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
}
