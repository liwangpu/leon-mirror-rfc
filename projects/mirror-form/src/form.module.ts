import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { ComponentRegistryService } from './services/component-registry.service';
import { COMPONENTREGISTRY } from '@cxist/mirror-core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [FormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    providers:[
        ComponentRegistryService,
        {
            provide: COMPONENTREGISTRY,
            useExisting: ComponentRegistryService,
            multi: true
        }
    ]
})
export class FormModule { }
