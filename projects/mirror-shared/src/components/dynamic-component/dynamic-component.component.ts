import { Component, OnInit, OnDestroy, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { SubSink } from 'subsink';
import { DynamicComponent } from '@cxist/mirror-core';

@Component({
    selector: 'mirror-dynamic-component',
    templateUrl: './dynamic-component.component.html',
    styleUrls: ['./dynamic-component.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicComponentComponent implements OnInit, OnDestroy {

    @HostBinding('class.preview')
    private preview: boolean;
    private subs = new SubSink();
    public constructor(
        private store: fromCore.StateStoreService,
        private dyc: DynamicComponent,
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.store.previewMode$.subscribe(enable => this.preview = enable);
        // console.log(1, this.dyc);
    }

    // @HostListener('mouseover', ['$event'])
    // private onMouseEnter(e: any): void {
    //     e.stopPropagation();
    //     console.log('mouse enter');
    //     this.preview = true;
    // }

    // @HostListener('mouseout', ['$event'])
    // private onMouseLeave(e: any): void {
    //     e.stopPropagation();
    //     console.log('mouse leave');
    //     this.preview = false;
    // }


}
