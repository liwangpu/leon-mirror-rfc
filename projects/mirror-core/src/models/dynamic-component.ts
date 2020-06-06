import { Injector, ViewContainerRef, ComponentRef } from '@angular/core';
import { IComponentMetaData } from './i-component-meta-data';
import { COMPONENTMETADATA } from '../tokens/component-meta-data';
import { IComponentDiscovery, COMPONENTDISCOVERY } from '../tokens/component-discovery';
import { IComponentDesignDataStore, COMPONENTDESIGNDATASTORE } from '../tokens/component-design-data-store';
import * as merge from 'deepmerge';
import { Store } from '@ngrx/store';
import { IMirrorState } from '../state-store/states/i-mirror-state';
import { selectPreviewMode } from '../state-store/selectors/mirror.selector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


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
    private _store: Store<IMirrorState>;
    private dynamicComponentContainer = new Map<string, ViewContainerRef>();
    public constructor(
        protected injector: Injector
    ) { }

    private get store(): Store<IMirrorState> {
        if (!this._store) {
            this._store = this.injector.get(Store);
        }
        return this._store;
    }

    protected get metaData(): IComponentMetaData {
        if (!this._metaData) {
            this._metaData = this.injector.get(COMPONENTMETADATA, {});
        }
        return this._metaData;
    }

    protected abstract async render(): Promise<void>;
    protected async startup(): Promise<void> {
        await this.render();

        // 渲染子组件
        if (!this.metaData.content?.length) { return; }
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
            let dyc: ComponentRef<any> = vc.createComponent(fac, null, ij);
        }

        // console.log('start render children');
    }
    protected async destroy(): Promise<void> {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }
}
