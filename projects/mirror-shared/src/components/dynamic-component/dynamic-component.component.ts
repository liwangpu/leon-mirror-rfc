import { Component, OnInit, OnDestroy, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { SubSink } from 'subsink';
import { DynamicComponent } from '@cxist/mirror-core';

@Component({
    selector: 'mirror-dynamic-component',
    templateUrl: './dynamic-component.component.html',
    styleUrls: ['./dynamic-component.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicComponentComponent implements OnInit, OnDestroy {

    @HostBinding('class.preview')
    private preview: boolean;
    private subs = new SubSink();
    public constructor(
        private store: fromCore.StateStoreService,
        private dyc: DynamicComponent,
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.store.previewMode$.subscribe(enable => this.preview = enable);
        // console.log(1, this.dyc);
    }

        // protected get store(): Store<IMirrorState> {
    //     if (!this._store) {
    //         this._store = this.injector.get(Store);
    //     }
    //     return this._store;
    // }

    // private async checkAndImplementInitialization(): Promise<void> {
    //     if (!this['initialize'] || !this['parameters']) { return; }
    //     let parameters = this['parameters']
    //     let variables = ExpressionTranslator.analyzeExpressionVariable(parameters);
    //     if (variables.length) {
    //         this.store.select(selectValueScopeAndVariables)
    //             .pipe(takeUntil(this.destroy$))
    //             .pipe(debounceTime(100))
    //             .subscribe((res: { scope: { [key: string]: any }, variables: Array<string> }) => {
    //                 let all = ArrayTool.allContain(res.variables, variables);
    //                 if (!all) { return; }
    //                 let data = ExpressionTranslator.translateStaticVariableExpression(parameters, res.scope);
    //                 this['initialize'](data)
    //             });
    //     } else {
    //         this['initialize'](parameters);
    //     }
    // }

    // @HostListener('mouseover', ['$event'])
    // private onMouseEnter(e: any): void {
    //     e.stopPropagation();
    //     console.log('mouse enter');
    //     this.preview = true;
    // }

    // @HostListener('mouseout', ['$event'])
    // private onMouseLeave(e: any): void {
    //     e.stopPropagation();
    //     console.log('mouse leave');
    //     this.preview = false;
    // }


}
