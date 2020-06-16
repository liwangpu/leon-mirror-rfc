import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { SubSink } from 'subsink';

@Component({
    selector: 'mirror-dynamic-component',
    templateUrl: './dynamic-component.component.html',
    styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentComponent implements OnInit, OnDestroy {

    @HostBinding('class.preview')
    private preview: boolean;
    private subs = new SubSink();
    public constructor(
        private store: fromCore.StateStoreService
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.store.previewMode$.subscribe(enable => this.preview = enable);
    }

}
