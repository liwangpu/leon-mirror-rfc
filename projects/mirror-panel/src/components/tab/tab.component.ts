import { Component, OnInit, forwardRef, Injector, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
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
export class TabComponent extends DynamicComponent implements AfterViewInit {

    @ViewChild('container', { static: false, read: ViewContainerRef })
    @DynamicComponentContainer()
    private container: ViewContainerRef;
    public constructor(
        injector: Injector
    ) {
        super(injector);
    }

    protected async render(): Promise<void> {

    }

    public async ngAfterViewInit(): Promise<void> {
        await this.startup();
    }

    public ngOnDestroy(): void {
        this.destroy();
    }
}
