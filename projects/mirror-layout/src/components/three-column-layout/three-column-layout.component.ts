import { Component, OnInit, forwardRef, AfterViewInit, OnDestroy, ViewChild, ViewContainerRef, Injector } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';

@Component({
    selector: 'mirror-three-column-layout',
    templateUrl: './three-column-layout.component.html',
    styleUrls: ['./three-column-layout.component.scss'],
    providers: [
        {
            provide: fromCore.DynamicComponent,
            useExisting: forwardRef(() => ThreeColumnLayoutComponent)
        }
    ]
})
export class ThreeColumnLayoutComponent extends fromCore.DynamicComponent implements AfterViewInit, OnDestroy {

    @ViewChild('leftContainer', { static: false, read: ViewContainerRef })
    @fromCore.DyContainer('left')
    public leftContainer: ViewContainerRef;
    @ViewChild('middleContainer', { static: false, read: ViewContainerRef })
    @fromCore.DyContainer('middle')
    public middleContainer: ViewContainerRef;
    @ViewChild('rightContainer', { static: false, read: ViewContainerRef })
    @fromCore.DyContainer('right')
    public rightContainer: ViewContainerRef;
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

