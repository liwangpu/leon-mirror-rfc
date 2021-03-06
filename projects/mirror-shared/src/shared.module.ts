import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromComponent from './components';

@NgModule({
    declarations: [fromComponent.components],
    imports: [
        CommonModule
    ],
    exports: [
        fromComponent.DynamicComponentComponent,
        fromComponent.DynamicModalComponent
    ],
    entryComponents: [
        fromComponent.DynamicModalComponent
    ]
})
export class SharedModule { }
