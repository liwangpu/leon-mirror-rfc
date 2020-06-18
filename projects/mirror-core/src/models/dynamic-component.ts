import { Injector, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { IComponentMetaData } from './i-component-meta-data';
import * as fromToken from '../tokens';
import * as merge from 'deepmerge';
import * as fromService from '../services';
import * as fromTool from '../utils';

export function ChildComponentContainer(containerId?: string) {
    containerId = containerId || '';
    return function (target: Object, propertyName: string) {
        let _val = null;
        function setter(val: any) {
            this._childComponentContainer.set(containerId, val);
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

    private _metaData: IComponentMetaData;
    private _stateStore: fromService.StateStoreService;
    private _childComponentContainer = new Map<string, ViewContainerRef>();
    private _initialParameters: { [key: string]: any };
    private _filterParameters: { [key: string]: any };
    public constructor(
        protected injector: Injector
    ) { }

    public get key(): string {
        return this.metaData.key;
    }

    public get title(): string {
        return this.metaData.title;
    }

    public get metaData(): IComponentMetaData {
        if (!this._metaData) {
            this._metaData = this.injector.get(fromToken.COMPONENTMETADATA, {});
        }
        return this._metaData;
    }

    public get subscribe(): { [key: string]: any } {
        return this.metaData.subscribe;
    }

    public get initialParameters(): { [key: string]: any } {
        if (!this._initialParameters) {
            this._initialParameters = this.metaData.initialParameters;
        }
        return this._initialParameters;
    }

    public get filterParameters(): { [key: string]: any } {
        if (!this._filterParameters) {
            this._filterParameters = this.metaData.filter;
        }
        return this._filterParameters;
    }

    protected get stateStore(): fromService.StateStoreService {
        if (!this._stateStore) {
            this._stateStore = this.injector.get(fromService.StateStoreService);
        }
        return this._stateStore;
    }

    protected async renderChildrenComponent(): Promise<void> {
        if (!this.metaData.content?.length) { return; }
        if (!this._childComponentContainer.size) {
            console.warn(`该组件是有定义子组件的,而组件却没有声明ViewContainerRef,请检查`);
            return;
        }

        const componentDiscoverySrv: fromToken.IComponentDiscovery = this.injector.get(fromToken.COMPONENTDISCOVERY);
        const componentDesignDataStore: fromToken.IComponentDesignDataStore = this.injector.get(fromToken.COMPONENTDESIGNDATASTORE);
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
                    provide: fromToken.COMPONENTMETADATA,
                    useValue: cmd
                }
            ], this.injector);
            let containerId: string = cmd.containerId || '';
            let vc = this._childComponentContainer.get(containerId);
            // debugger;
            if (!vc) {
                console.error(`没有找到containerId为 "${containerId}" 的ViewContainerRef,请检查containerId是否写错或者动态组件宿主是否已经提供该Ref`);
                continue;
            }
            vc.createComponent(fac, null, ij);
        }
    }

    protected publishValueChange(data: { [key: string]: any }): void {
        if (!data) { return; }
        if (!this.metaData.notify?.length) { return; }
        let properties: Array<string> = Object.keys(data);
        if (!properties.length) { return; }

        let scope: { [key: string]: any } = {};
        this.metaData.notify.forEach(it => {
            if (!properties.some(x => x === it.source)) { return; }
            let name = it.target || it.source;
            scope[name] = fromTool.ObjectTool.recursionValueByField(data, it.source);
        });
        this.stateStore.setScopeData(scope);
    }

}
