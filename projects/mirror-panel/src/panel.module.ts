import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './components/tab/tab.component';
import { ComponentRegistryService } from './services/component-registry.service';
import { COMPONENTREGISTRY } from '@cxist/mirror-core';
import { SharedModule as MirrorSharedModule } from '@cxist/mirror-shared';
import { ActionButtonComponent } from './components/action-button/action-button.component';


@NgModule({
    declarations: [TabComponent, ActionButtonComponent],
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
export class PanelModule { }
