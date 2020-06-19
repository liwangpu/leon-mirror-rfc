import { Component, OnInit, forwardRef, Injector, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DynamicComponent, DyContainer } from '@cxist/mirror-core';

@Component({
    selector: 'mirror-blank-layout',
    templateUrl: './blank-layout.component.html',
    styleUrls: ['./blank-layout.component.scss'],
    providers: [
        {
            provide: DynamicComponent,
            useExisting: forwardRef(() => BlankLayoutComponent)
        }
    ]
})
export class BlankLayoutComponent extends DynamicComponent implements AfterViewInit, OnDestroy {

    @ViewChild('container', { static: false, read: ViewContainerRef })
    @DyContainer()
    private container: ViewContainerRef;
    public constructor(
        injector: Injector
    ) {
        super(injector);
    }

    public async ngAfterViewInit(): Promise<void> {
        await super.renderChildrent();
    }

    public async ngOnDestroy(): Promise<void> {

    }

}
