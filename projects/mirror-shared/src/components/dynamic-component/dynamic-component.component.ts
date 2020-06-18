import { Component, OnInit, OnDestroy, HostBinding, HostListener, ChangeDetectionStrategy, Injector } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { SubSink } from 'subsink';
import { filter } from 'rxjs/operators';

function satisfyVariables(variables: Array<string>): any {
    return filter(scope => {
        if (!scope) { return false; }
        return fromCore.ArrayTool.allContain(Object.keys(scope), variables);
    });
}

@Component({
    selector: 'mirror-dynamic-component',
    templateUrl: './dynamic-component.component.html',
    styleUrls: ['./dynamic-component.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicComponentComponent implements OnInit, OnDestroy {

    @HostBinding('class.preview')
    public preview: boolean;
    private _store: fromCore.StateStoreService;
    private _opsat: fromCore.PageNotifyOpsatService;
    private subs = new SubSink();
    public constructor(
        private injector: Injector,
        private dyc: fromCore.DynamicComponent
    ) { }

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
        return presentation.initialParameters && Object.keys(presentation.initialParameters).length && typeof presentation.InitialParameterChange === 'function';
    }

    private get checkPresentationIsFilterable(): boolean {
        let presentation: fromCore.IFilter = this.dyc as any;
        return presentation.filterParameters && Object.keys(presentation.filterParameters).length && typeof presentation.filterParameterChange === 'function';
    }

    private get checkPresentationIsSubscribe(): boolean {
        let presentation: fromCore.ISubscribe = this.dyc as any;
        return presentation.subscribe && presentation.subscribe.length && typeof presentation.onNotify === 'function';
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.store.previewMode$.subscribe(enable => this.preview = enable);

        if (this.checkPesentationIsInitializable) {
            this.presentationImplementInitialization();
        }

        if (this.checkPresentationIsFilterable) {
            this.presentationImplementFilterable();
        }

        if (this.checkPresentationIsSubscribe) {
            this.presentationImplementSubscribe();
        }

    }

    private presentationImplementInitialization(): void {
        let presentation: fromCore.IInitialize = this.dyc as any;
        let variables = fromCore.ExpressionTranslator.analyzeExpressionVariable(presentation.initialParameters);
        if (!variables.length) {
            presentation.InitialParameterChange(presentation.initialParameters);
            return;
        }
        this.subs.sink = this.store.scopeData$
            .pipe(satisfyVariables(variables))
            .subscribe(async scope => {
                let data = fromCore.ExpressionTranslator.translateStaticVariableExpression(presentation.initialParameters, scope);
                // console.log('scope', scope, data);
                await presentation.InitialParameterChange(data);
            });
    }

    private presentationImplementFilterable(): void {
        let presentation: fromCore.IFilter = this.dyc as any;
        let variables = fromCore.ExpressionTranslator.analyzeExpressionVariable(presentation.filterParameters);
        if (!variables.length) {
            presentation.filterParameterChange(presentation.filterParameters);
            return;
        }

        this.subs.sink = this.store.scopeData$
            .pipe(satisfyVariables(variables))
            .subscribe(async scope => {
                let data = fromCore.ExpressionTranslator.translateStaticVariableExpression(presentation.filterParameters, scope);
                // console.log('scope', scope, data);
                await presentation.filterParameterChange(data);
            });
    }

    private presentationImplementSubscribe(): void {
        let presentation: fromCore.ISubscribe = this.dyc as any;

        this.subs.sink = this.opsat.message.subscribe(async notify => {
            await presentation.onNotify(notify);
        });
    }

}
