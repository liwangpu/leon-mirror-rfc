import { Component, OnInit, AfterViewInit, OnDestroy, Injector, forwardRef } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';

@Component({
    selector: 'mirror-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        {
            provide: fromCore.DynamicComponent,
            useExisting: forwardRef(() => GridComponent)
        }
    ]
})
export class GridComponent extends fromCore.DynamicComponent implements fromCore.IFilter {

    public constructor(
        injector: Injector
    ) {
        super(injector);
    }
    
    public async onNotify(notify: fromCore.INotification): Promise<void> {
        console.log('grid get event', notify); 
    }

    public async filterParameterChange(data: { [key: string]: any; }): Promise<void> {
        console.log('grid get filter data', data);
    }

}
