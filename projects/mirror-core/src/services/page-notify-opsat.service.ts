import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { INotification } from '../models';

@Injectable()
export class PageNotifyOpsatService implements OnDestroy {

    private _message: Subject<INotification> = new Subject<INotification>();
    public get message(): Observable<INotification> {
        return this._message.asObservable();
    }

    public ngOnDestroy(): void {
        this._message.complete();
        this._message.unsubscribe();
        // console.log('page opsat destroy');
    }

    public publish(event: string, data?: any): void {
        if (this._message.isStopped || this._message.closed) {
            return;
        }
        this._message.next({ source: event, target: data });
    }
}
