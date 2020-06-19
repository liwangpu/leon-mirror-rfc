import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRegistryService } from './services/component-registry.service';
import { COMPONENTREGISTRY } from '@cxist/mirror-core';
import { SharedModule as MirrorSharedModule } from '@cxist/mirror-shared';
import * as fromComponent from './components';


@NgModule({
    declarations: [...fromComponent.components],
    imports: [
        CommonModule,
        MirrorSharedModule
    ],
    providers: [
        ComponentRegistryService,
        {
            provide: COMPONENTREGISTRY,
            useExisting: ComponentRegistryService,
            multi: true
        }
    ]
})
export class LayoutModule { }
