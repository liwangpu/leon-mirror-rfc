import { Injector, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { IComponentMetaData } from './i-component-meta-data';
import { COMPONENTMETADATA } from '../tokens/component-meta-data';
import { IComponentDiscovery, COMPONENTDISCOVERY } from '../tokens/component-discovery';
import { IComponentDesignDataStore, COMPONENTDESIGNDATASTORE } from '../tokens/component-design-data-store';
import * as merge from 'deepmerge';
import { Store } from '@ngrx/store';
// import { IMirrorState } from '../state-store/states/i-mirror-state';
import { Subject } from 'rxjs';
import { ObjectTool } from '../utils/object-tool';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { ExpressionTranslator } from '../utils/expression-translator';
import { ArrayTool } from '../utils/array-tool';


export function DynamicComponentContainer(containerId?: string) {
    containerId = containerId || '';
    return function (target: Object, propertyName: string) {
        let _val = null;
        function setter(val: any) {
            <DynamicComponent>this.dynamicComponentContainer.set(containerId, val);
            _val = val;
        }

        function getter() {
            return _val;
        }

        Object.defineProperty(target, propertyName, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}

export abstract class DynamicComponent {

    private destroy$ = new Subject<boolean>();
    private _metaData: IComponentMetaData;
    // private _store: Store<IMirrorState>;
    private dynamicComponentContainer = new Map<string, ViewContainerRef>();
    public constructor(
        protected injector: Injector
    ) { }

    protected get metaData(): IComponentMetaData {
        if (!this._metaData) {
            this._metaData = this.injector.get(COMPONENTMETADATA, {});
        }
        return this._metaData;
    }

    // protected get store(): Store<IMirrorState> {
    //     if (!this._store) {
    //         this._store = this.injector.get(Store);
    //     }
    //     return this._store;
    // }

    private async renderChildrenComponent(): Promise<void> {
        if (!this.metaData.content?.length) { return; }
        if (!this.dynamicComponentContainer.size) {
            console.warn(`该组件是有定义子组件的,而组件却没有声明ViewContainerRef,请检查`);
            return;
        }

        const componentDiscoverySrv: IComponentDiscovery = this.injector.get(COMPONENTDISCOVERY);
        const componentDesignDataStore: IComponentDesignDataStore = this.injector.get(COMPONENTDESIGNDATASTORE);
        for (let cmd of this.metaData.content) {
            if (cmd.key) {
                let m = await componentDesignDataStore.getMetaData(cmd.key).toPromise();
                cmd = merge(cmd, m);
            }
            let fac = componentDiscoverySrv.generateComponentFactory(cmd.control);
            if (!fac) {
                console.error(`组件库里面没有找到control为${cmd.control}的组件,请检查是否注册或者写错`, cmd);
                continue;
            }

            const ij = Injector.create([
                {
                    provide: COMPONENTMETADATA,
                    useValue: cmd
                }
            ], this.injector);
            let containerId: string = cmd.containerId || '';
            let vc = this.dynamicComponentContainer.get(containerId);
            // debugger;
            if (!vc) {
                console.error(`没有找到containerId为 "${containerId}" 的ViewContainerRef,请检查containerId是否写错或者动态组件宿主是否已经提供该Ref`);
                continue;
            }
            vc.createComponent(fac, null, ij);
        }
    }

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

    protected publishValueChange(data: { [key: string]: any }): void {
        if (!this.metaData.notify?.length) { return; }

        // let keys:Array<string>=
        this.metaData.notify.forEach(it => {
            let name = it.target || it.source;
            // console.log(typeof data[it.source]);
            let value = ObjectTool.recursionValueByField(data, it.source);
            if (typeof value === 'undefined') { return; }
            // this.store.dispatch(valueChange({ name, value }));
        });
        // console.log(1, data);
    }

    // public async ngAfterViewInit(): Promise<void> {
    //     // initialize接口实现判断
    //     await this.checkAndImplementInitialization();
    //     // 渲染子组件
    //     await this.renderChildrenComponent();
    //     // console.log('start render children');
    // }

    // public async ngOnDestroy(): Promise<void> {
    //     this.destroy$.next(true);
    //     this.destroy$.complete();
    //     this.destroy$.unsubscribe();
    // }
}
