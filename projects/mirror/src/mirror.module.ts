import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MirrorRoutingModule } from './mirror-routing.module';
import { LayoutModule as MirrorLayoutModule } from '@cxist/mirror-layout';
import * as fromService from './services';
import * as fromCore from '@cxist/mirror-core';
import { GridModule as MirrorGridModule } from '@cxist/mirror-grid';
import { PanelModule as MirrorPanelModule } from '@cxist/mirror-panel';
import { FormModule as MirrorFormModule } from '@cxist/mirror-form';
import * as fromOrion from '@byzan/orion2';
import { TreeViewModule as MirrorTreeViewModule } from '@cxist/mirror-tree-view';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MirrorRoutingModule,
        MirrorLayoutModule,
        MirrorPanelModule,
        MirrorGridModule,
        MirrorFormModule,
        MirrorTreeViewModule,
        fromCore.StateStoreModule,
        fromOrion.DynamicDialogModule
    ],
    providers: [
        fromService.PageMetaDataResolverService,
        fromService.ComponentDiscoveryService,
        fromService.PageMetaDataStoreService,
        fromService.ComponentDesignDataStoreService,
        fromService.ResourceDataStoreService,
        fromCore.PageNotifyOpsatService,
        {
            provide: fromCore.COMPONENTDISCOVERY,
            useExisting: fromService.ComponentDiscoveryService,
        },
        {
            provide: fromCore.PAGEMETADATASTORE,
            useExisting: fromService.PageMetaDataStoreService
        },
        {
            provide: fromCore.COMPONENTDESIGNDATASTORE,
            useExisting: fromService.ComponentDesignDataStoreService
        },
        {
            provide: fromCore.RESOURCEDATASTORE,
            useExisting: fromService.ResourceDataStoreService
        },
    ]
})
export class MirrorModule { }
