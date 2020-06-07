import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MirrorRoutingModule } from './mirror-routing.module';
import { LayoutModule as MirrorLayoutModule } from '@cxist/mirror-layout';
import { ComponentDiscoveryService } from './services/component-discovery.service';
import { PageMetaDataResolverService } from './services/page-meta-data-resolver.service';
import { PageMetaDataStoreService } from './services/page-meta-data-store.service';
import { ComponentDesignDataStoreService } from './services/component-design-data-store.service';
import { COMPONENTDISCOVERY, PAGEMETADATASTORE, COMPONENTDESIGNDATASTORE, mirrorFeatureKey, mirrorReducer } from '@cxist/mirror-core';
import { StoreModule } from '@ngrx/store';
import { GridModule as MirrorGridModule } from '@cxist/mirror-grid';
import { PanelModule as MirrorPanelModule } from '@cxist/mirror-panel';
import { FormModule as MirrorFormModule } from '@cxist/mirror-form';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MirrorRoutingModule,
        MirrorLayoutModule,
        MirrorPanelModule,
        MirrorGridModule,
        MirrorFormModule,
        StoreModule.forFeature(mirrorFeatureKey, mirrorReducer),
    ],
    providers: [
        PageMetaDataResolverService,
        ComponentDiscoveryService,
        PageMetaDataStoreService,
        ComponentDesignDataStoreService,
        {
            provide: COMPONENTDISCOVERY,
            useExisting: ComponentDiscoveryService,
        },
        {
            provide: PAGEMETADATASTORE,
            useExisting: PageMetaDataStoreService
        },
        {
            provide: COMPONENTDESIGNDATASTORE,
            useExisting: ComponentDesignDataStoreService
        },
    ]
})
export class MirrorModule { }
