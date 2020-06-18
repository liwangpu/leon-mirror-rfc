import { Injector, ViewContainerRef } from '@angular/core';
import * as fromToken from '../tokens';
import * as merge from 'deepmerge';
import * as fromService from '../services';
import * as fromTool from '../utils';
import { INotification, notificationType } from './i-notification';
import { MetaDataProvider } from './meta-data-provider';
import { INotify } from './i-notify';
import { IDataSource } from './i-data-source';

function generateResourceChangeNotify(dataSourceKey: string, ids?: Array<string>): INotification {
    return { type: notificationType.resourceChange, source: dataSourceKey, target: ids };
}

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

export abstract class DynamicComponent extends MetaDataProvider implements INotify {

    private _opsat: fromService.PageNotifyOpsatService;
    private _stateStore: fromService.StateStoreService;
    private _childComponentContainer = new Map<string, ViewContainerRef>();
    public constructor(
        injector: Injector
    ) {
        super(injector);
        this.checkAndImplementDataSource();
    }

    private get opsat(): fromService.PageNotifyOpsatService {
        if (!this._opsat) {
            this._opsat = this.injector.get(fromService.PageNotifyOpsatService);
        }
        return this._opsat;
    }

    protected get stateStore(): fromService.StateStoreService {
        if (!this._stateStore) {
            this._stateStore = this.injector.get(fromService.StateStoreService);
        }
        return this._stateStore;
    }

    public async renderChildrent(): Promise<void> {
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

    public publishScopeData(data: { [key: string]: any }): void {
        if (!data) { return; }
        if (!this.notify?.length || !this.notify.some(x => x.type === 'valueChange')) { return; }
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

    public publishNotify(notify: INotification): void {
        this.opsat.publish(notify);
    }

    private checkAndImplementDataSource(): void {
        if (!this.dataSourceKey) { return; }

        let dyc: DynamicComponent = this;
        let dataSource: IDataSource = this as any;
        if (typeof dataSource.createResource === 'function') {
            let originCreateResource: Function = dataSource.createResource;
            Object.defineProperty(this, dataSource.createResource.name, {
                value: async function (...args: any[]) {
                    let id = await originCreateResource.apply(this, args);
                    let notify = generateResourceChangeNotify(dataSource.dataSourceKey, [id]);
                    dyc.publishNotify(notify);
                    return id;
                }
            });
        }
        // dataSource
    }

}
