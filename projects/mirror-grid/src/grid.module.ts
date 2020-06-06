import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid/grid.component';
import { ComponentRegistryService } from './services/component-registry.service';
import { COMPONENTREGISTRY } from '@cxist/mirror-core';


@NgModule({
    declarations: [GridComponent],
    imports: [
        CommonModule
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
export class GridModule { }
