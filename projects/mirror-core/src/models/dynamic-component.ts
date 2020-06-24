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

export function DyContainer(containerId?: string) {
    containerId = containerId || '';
    return function (target: Object, propertyName: string) {
        let _val = null;
        function setter(val: any) {
            this._dyContainer.set(containerId, val);
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
    private _dyContainer = new Map<string, ViewContainerRef>();
    private _componentDiscoverySrv: fromToken.IComponentDiscovery;
    private _componentDesignDataStore: fromToken.IComponentDesignDataStore;
    private _renderFn: Function;
    public constructor(
        injector: Injector
    ) {
        super(injector);
        this.checkAndImplementDataSource();
    }

    private get componentDiscoverySrv(): fromToken.IComponentDiscovery {
        if (!this._componentDiscoverySrv) {
            this._componentDiscoverySrv = this.injector.get(fromToken.COMPONENTDISCOVERY);
        }
        return this._componentDiscoverySrv;
    }

    private get componentDesignDataStore(): fromToken.IComponentDesignDataStore {
        if (!this._componentDesignDataStore) {
            this._componentDesignDataStore = this.injector.get(fromToken.COMPONENTDESIGNDATASTORE);
        }
        return this._componentDesignDataStore;
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

    public render(): void {
        if (this._renderFn) {
            this._renderFn();
        }
    }

    public async renderChildrent(): Promise<void> {
        await this.renderContentChildren();
        await this.renderButtonChildren();
    }

    public publishScopeData(data: { [key: string]: any }): void {
        if (!this.notify?.length) { return; }
        if (!data || typeof data !== 'object' || !Object.keys(data).length) {
            console.warn(`data必须为非空的object,当前传递的data类型为为:${typeof data},data详细信息为:`, data);
            return;
        }
        let scope: { [key: string]: any } = {};
        // 发送data 到 scope最后检查,非notify里面的字段不发送
        let fields = Object.keys(data);
        fields.forEach(f => {
            let needNotify = this.metaData.notify.some(x => x.source === f || x.target === f);
            if (needNotify) {
                scope[f] = data[f];
            }
        });
        this.stateStore.setScopeData(scope);
    }

    public publishNotify(notify: INotification): void {
        this.opsat.publish(notify);
    }

    private registryRender(fn: Function): void {
        this._renderFn = fn;
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


        if (typeof dataSource.updateResource === 'function') {
            let originUpdateResource: Function = dataSource.updateResource;
            Object.defineProperty(this, dataSource.updateResource.name, {
                value: async function (...args: any[]) {
                    let entity = args[0];
                    await originUpdateResource.apply(this, args);
                    let notify = generateResourceChangeNotify(dataSource.dataSourceKey, [entity.id]);
                    dyc.publishNotify(notify);
                    console.log(notify);
                    return;
                }
            });
        }
    }

    private async renderContentChildren(): Promise<void> {
        if (!this.metaData.content?.length) { return; }
        if (!this._dyContainer.size) {
            console.warn(`该组件是有定义子组件的,而组件却没有声明任何DyContainer,请检查`);
            return;
        }

        for (let cmd of this.metaData.content) {
            if (cmd.key) {
                let m = await this.componentDesignDataStore.getMetaData(cmd.key).toPromise();
                cmd = merge(cmd, m);
            }
            let fac = this.componentDiscoverySrv.generateComponentFactory(cmd.control);
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
            let vc = this._dyContainer.get(containerId);
            if (!vc) {
                console.error(`没有找到containerId为 "${containerId}" 的ViewContainerRef,请检查containerId是否写错或者动态组件宿主是否已经提供该Ref`);
                continue;
            }
            vc.createComponent(fac, null, ij);
        }
    }

    private async renderButtonChildren(): Promise<void> {
        if (!this.actions || !this.actions.length) { return; }
        if (!this._dyContainer.size || !this._dyContainer.get('button')) {
            console.warn(`该组件是有定义按钮的,而组件却没有声明类型为button的DyContainer,请检查`);
            return;
        }

        let fac = this.componentDiscoverySrv.generateComponentFactory('action-button');
        if (!fac) {
            console.error(`组件库里面没有找到control为action-button的组件,请检查是否注册或者写错`);
            return;
        }

        const ij = Injector.create([
            {
                provide: fromToken.ACTIONBUTTONMETADATA,
                useValue: this.actions
            }
        ], this.injector);
        const vc = this._dyContainer.get('button');
        vc.createComponent(fac, null, ij);
    }

}
