import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { ComponentRegistryService } from './services/component-registry.service';
import { COMPONENTREGISTRY } from '@cxist/mirror-core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@cxist/mirror-shared';
import * as fromOrion from '@byzan/orion2';
import { GradeFormComponent } from './components/grade-form/grade-form.component';

@NgModule({
    declarations: [FormComponent, GradeFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        fromOrion.InputModule,
        fromOrion.SelectModule,
        fromOrion.FormModule,
        fromOrion.ButtonModule
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
export class FormModule { }
