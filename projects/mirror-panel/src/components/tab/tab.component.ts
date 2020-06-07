import { Component, OnInit, forwardRef, Injector, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DynamicComponent, DynamicComponentContainer } from '@cxist/mirror-core';

@Component({
    selector: 'mirror-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss'],
    providers: [
        {
            provide: DynamicComponent,
            useExisting: forwardRef(() => TabComponent)
        }
    ]
})
export class TabComponent extends DynamicComponent implements AfterViewInit, OnDestroy {

    @ViewChild('container', { static: false, read: ViewContainerRef })
    @DynamicComponentContainer()
    private container: ViewContainerRef;
    public constructor(
        injector: Injector
    ) {
        super(injector);
    }

    public async ngAfterViewInit(): Promise<void> {
        await super.ngAfterViewInit();
    }

    public async ngOnDestroy(): Promise<void> {
        await super.ngOnDestroy();
    }
}
