import { Component, OnInit, forwardRef, Injector, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DynamicComponent, DyContainer } from '@cxist/mirror-core';

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
    @DyContainer()
    private container: ViewContainerRef;
    public constructor(
        injector: Injector
    ) {
        super(injector);
    }

    public async ngAfterViewInit(): Promise<void> {
        this.render();
        await super.renderChildrent();
    }

    public async ngOnDestroy(): Promise<void> {

    }
}
