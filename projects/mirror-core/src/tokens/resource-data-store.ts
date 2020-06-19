import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IQueryResult } from '../models/i-query-result';

export interface IResourceDataStore {

    query<T = any>(resource: string, queryParam?: object): Observable<IQueryResult<T>>;
    get<T = any>(resource: string, id: string): Observable<T>;
    create<T = any>(resource: string, entity: T): Observable<T>;
    patch<T = any>(resource: string, id: string, entity: any): Observable<T>;
}

export const RESOURCEDATASTORE: InjectionToken<IResourceDataStore> = new InjectionToken<IResourceDataStore>('resource data store');