import { Component, OnInit, OnDestroy, HostBinding, HostListener, ChangeDetectionStrategy, Injector, AfterViewInit } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { SubSink } from 'subsink';
import { filter } from 'rxjs/operators';
import { notificationType } from '@cxist/mirror-core';
import * as _ from 'lodash';

function satisfyVariables(variables: Array<string>): any {
    return filter(scope => {
        if (!scope) { return false; }
        return variables.every(v => _.has(scope, v));
    });
}


@Component({
    selector: 'mirror-dynamic-component',
    templateUrl: './dynamic-component.component.html',
    styleUrls: ['./dynamic-component.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicComponentComponent implements OnInit, AfterViewInit, OnDestroy {

    @HostBinding('class.preview')
    public preview: boolean;
    private _store: fromCore.StateStoreService;
    private _opsat: fromCore.PageNotifyOpsatService;
    private subs = new SubSink();
    public constructor(
        private injector: Injector,
        private dyc: fromCore.DynamicComponent
    ) {
        this.dyc['registryRender'](() => {
            if (this.checkPesentationIsInitializable) {
                this.presentationImplementInitialization();
            }

            if (this.checkPresentationIsFilterable) {
                this.presentationImplementFilterable();
            }

            if (this.checkPresentationIsSubscribe) {
                this.presentationImplementSubscribe();
            }

            if (this.checkPresentationIsDataSource) {
                this.presentationImplementResourceChange();
            }
        });
    }

    public ngOnInit(): void {
        this.subs.sink = this.store.previewMode$.subscribe(enable => this.preview = enable);
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.dyc['render']();
        }, 10);
    }

    protected get store(): fromCore.StateStoreService {
        if (!this._store) {
            this._store = this.injector.get(fromCore.StateStoreService);
        }
        return this._store;
    }

    protected get opsat(): fromCore.PageNotifyOpsatService {
        if (!this._opsat) {
            this._opsat = this.injector.get(fromCore.PageNotifyOpsatService);
        }
        return this._opsat;
    }

    private get checkPesentationIsInitializable(): boolean {
        let presentation: fromCore.IInitialize = this.dyc as any;
        return presentation.initialParameter && Object.keys(presentation.initialParameter).length && typeof presentation.InitialParameterChange === 'function';
    }

    private get checkPresentationIsFilterable(): boolean {
        let presentation: fromCore.IFilter = this.dyc as any;
        return presentation.filterParameter && Object.keys(presentation.filterParameter).length && typeof presentation.filterParameterChange === 'function';
    }

    private get checkPresentationIsSubscribe(): boolean {
        let presentation: fromCore.ISubscribe = this.dyc as any;
        return presentation.subscribe && presentation.subscribe.length && typeof presentation.onNotify === 'function';
    }

    private get checkPresentationIsDataSource(): boolean {
        let presentation: fromCore.IDataSource = this.dyc as any;
        return presentation.dataSourceKey && typeof presentation.onResourceChange === 'function';
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }



    private presentationImplementInitialization(): void {
        let presentation: fromCore.IInitialize = this.dyc as any;
        if (!presentation.initialParameter) { return; }
        this.subs.sink = this.store.notifyWhenExpressionChange(presentation.initialParameter).subscribe(async data => {
            // console.log('initial parameter change', data);
            await presentation.InitialParameterChange(data);
        });
    }

    private presentationImplementFilterable(): void {
        let presentation: fromCore.IFilter = this.dyc as any;
        if (!presentation.filterParameter) { return; }
        this.subs.sink = this.store.notifyWhenExpressionChange(presentation.filterParameter).subscribe(async data => {
            // console.log('filter parameter change', data);
            await presentation.filterParameterChange(data);
        });
    }

    private presentationImplementSubscribe(): void {
        let presentation: fromCore.ISubscribe = this.dyc as any;

        this.subs.sink = this.opsat.message.subscribe(async notify => {
            if (!presentation.subscribe.some(x => x.source == notify.source)) { return; }
            await presentation.onNotify(notify);
        });
    }

    private presentationImplementResourceChange(): void {
        let presentation: fromCore.IDataSource = this.dyc as any;
        this.subs.sink = this.opsat.message.subscribe(async notify => {
            if (notify.type !== notificationType.resourceChange || notify.source !== presentation.dataSourceKey) { return; }

            await presentation.onResourceChange(notify.target);
        });
    }

}
