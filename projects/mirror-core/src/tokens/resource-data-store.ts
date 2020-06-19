import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IQueryResult } from '../models/i-query-result';

export interface IResourceDataStore {

    query<T = any>(resource: string, queryParam?: object): Observable<IQueryResult<T>>;

    create<T = any>(resource: string, entity: T): Observable<T>;
}

export const RESOURCEDATASTORE: InjectionToken<IResourceDataStore> = new InjectionToken<IResourceDataStore>('resource data store');