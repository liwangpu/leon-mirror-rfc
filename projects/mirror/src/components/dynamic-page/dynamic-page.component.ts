import { Component, OnInit, Injector, ViewChild, ViewContainerRef, OnDestroy, Inject, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { IPageMetaData, COMPONENTDESIGNDATASTORE, IComponentDesignDataStore, COMPONENTDISCOVERY, IComponentDiscovery, COMPONENTMETADATA, IMirrorState, updatePageMetaData, selectPageMetaData, openPreviewMode, closePreviewMode } from '@cxist/mirror-core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

@Component({
    selector: 'mirror-dynamic-page',
    templateUrl: './dynamic-page.component.html',
    styleUrls: ['./dynamic-page.component.scss']
})
export class DynamicPageComponent implements OnInit, OnDestroy {

    @ViewChild('layoutContainer', { static: true, read: ViewContainerRef })
    private layoutContainer: ViewContainerRef;
    private destroy$ = new Subject<boolean>();
    public constructor(
        acr: ActivatedRoute,
        @Inject(COMPONENTDESIGNDATASTORE) private componentDesignDataStore: IComponentDesignDataStore,
        @Inject(COMPONENTDISCOVERY) private componentDiscoverySrv: IComponentDiscovery,
        private injector: Injector,
        private store: Store<IMirrorState>
    ) {
        acr.data
            .pipe(map(x => x['pageMetaData']))
            .subscribe((metaData: IPageMetaData) => {
                this.layoutContainer?.clear();
                this.store.dispatch(updatePageMetaData(metaData));
                // console.log('page meta data change', metaData);
            });
        acr.queryParams
            .pipe(map(q => q.preview))
            .subscribe((preview: boolean) => this.store.dispatch(preview ? openPreviewMode() : closePreviewMode()));
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }

    public ngOnInit(): void {
        this.store.select(selectPageMetaData)
            .pipe(takeUntil(this.destroy$))
            .pipe(switchMap(pageMetaData => this.componentDesignDataStore.getMetaData(pageMetaData.layout.control).pipe(map(m => ({ ...m, ...pageMetaData.layout })))))
            .subscribe(componentMetaData => {
                const ij = Injector.create([
                    {
                        provide: COMPONENTMETADATA,
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
