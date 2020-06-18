import { Component, OnInit, OnDestroy, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
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
    private subs = new SubSink();
    public constructor(
        private store: fromCore.StateStoreService,
        private dyc: fromCore.DynamicComponent,
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.store.previewMode$.subscribe(enable => this.preview = enable);
        // this.implementInitialization();

        if (this.checkPesentationIsInitializable) {
            this.presentationImplementInitialization();
        }
        // console.log(1, this.dyc);
    }

    /**
     * 校验Pesentation是否实现Initializable
     */
    private get checkPesentationIsInitializable(): boolean {
        let presentation: fromCore.IInitializable = this.dyc as any;
        return presentation.initialParameters && Object.keys(presentation.initialParameters).length && typeof presentation.InitialParameterChange === 'function';
    }

    /**
     * 为Pesentation实施Initializable
     */
    private presentationImplementInitialization(): void {
        let presentation: fromCore.IInitializable = this.dyc as any;
        let variables = fromCore.ExpressionTranslator.analyzeExpressionVariable(presentation.initialParameters);
        if (!variables.length) {
            presentation.InitialParameterChange(presentation.initialParameters);
            return;
        }
        // console.log('initial variables', variables);
        this.subs.sink = this.store.scopeData$
            .pipe(satisfyVariables(variables))
            .subscribe(async scope => {
                let data = fromCore.ExpressionTranslator.translateStaticVariableExpression(presentation.initialParameters, scope);
                // console.log('scope', scope, data);
                await presentation.InitialParameterChange(data);
            });
    }

}
