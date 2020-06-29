import { Component, OnInit, Injector, ViewChild, ViewContainerRef, OnDestroy, Inject, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil, switchMap, filter } from 'rxjs/operators';
import * as fromCore from '@cxist/mirror-core';
import { Subject } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
    selector: 'mirror-dynamic-page',
    templateUrl: './dynamic-page.component.html',
    styleUrls: ['./dynamic-page.component.scss']
})
export class DynamicPageComponent implements OnInit, OnDestroy {

    @ViewChild('layoutContainer', { static: true, read: ViewContainerRef })
    private layoutContainer: ViewContainerRef;
    private subs = new SubSink();
    public constructor(
        acr: ActivatedRoute,
        @Inject(fromCore.COMPONENTDESIGNDATASTORE) private componentDesignDataStore: fromCore.IComponentDesignDataStore,
        @Inject(fromCore.COMPONENTDISCOVERY) private componentDiscoverySrv: fromCore.IComponentDiscovery,
        private injector: Injector,
        private store: fromCore.StateStoreService
    ) {
        this.subs.sink = acr.data
            .pipe(map(x => x['pageMetaData']))
            .subscribe((metaData: fromCore.IPageMetaData) => {
                this.layoutContainer?.clear();
                this.store.resetScopeData('dynamic page');
                this.store.setPageMetaData(metaData);
            });
        this.subs.sink = acr.params
            .subscribe(data => {
                // this.store.setScopeData({ id: data.dataId }, 'params');
            });

        this.subs.sink = acr.queryParams
            // .pipe(map(q => q.preview))
            .subscribe(q => {

                let queryParamKeys = Object.keys(q).filter(x => ['preview'].indexOf(x) === -1);
                let scope: {} = {};
                queryParamKeys.forEach(k => scope[k] = q[k]);
                // this.store.setScopeData(scope, 'queryParams');
                this.store.resetPreviewMode(Boolean(q.preview));
            });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.store.pageMetaData$
            .pipe(switchMap(pageMetaData => this.componentDesignDataStore.getMetaData(pageMetaData.layout.control).pipe(map(m => ({ ...m, ...pageMetaData.layout })))))
            .subscribe(componentMetaData => {
                const ij = Injector.create([
                    {
                        provide: fromCore.COMPONENTMETADATA,
                        useValue: componentMetaData
                    }
                ], this.injector);
                let fac = this.componentDiscoverySrv.generateComponentFactory(componentMetaData.control);
                // console.log('layout', componentMetaData);
                if (!fac) {
                    console.error(`没有找到该页面配置对应的layout,请检查该layout是否注册`, componentMetaData);
                    return;
                }

                this.layoutContainer.createComponent(fac, null, ij);
            });
    }

}
