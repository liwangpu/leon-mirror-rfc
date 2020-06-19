import { NgModule } from '@angular/core';
import * as fromComponent from './components';
import * as fromService from './services';
import * as fromCore from '@cxist/mirror-core';
import { SharedModule } from '@cxist/mirror-shared';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [fromComponent.components],
    imports: [
        CommonModule,
        SharedModule
    ],
    providers: [
        fromService.ComponentRegistryService,
        {
            provide: fromCore.COMPONENTREGISTRY,
            useExisting: fromService.ComponentRegistryService,
            multi: true
        }
    ],
    exports: []
})
export class TreeViewModule { }
