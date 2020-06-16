import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid/grid.component';
import { ComponentRegistryService } from './services/component-registry.service';
import { COMPONENTREGISTRY } from '@cxist/mirror-core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@cxist/mirror-shared';

@NgModule({
    declarations: [GridComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule
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
