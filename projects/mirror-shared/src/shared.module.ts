import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentDesignerDirective } from './directives/component-designer.directive';

@NgModule({
    declarations: [ComponentDesignerDirective],
    imports: [
        CommonModule
    ],
    exports: [
        ComponentDesignerDirective
    ]
})
export class SharedModule { }
