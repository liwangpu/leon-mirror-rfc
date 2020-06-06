import { Directive, ElementRef, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { DynamicComponent, IMirrorState, selectPreviewMode } from '@cxist/mirror-core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[mirrorComponentDesigner]'
})
export class ComponentDesignerDirective implements OnInit, OnDestroy {

    @HostBinding('attr.preview-mode')
    private previewMode: boolean = false;
    private destroy$ = new Subject<boolean>();
    constructor(
        private el: ElementRef,
        private store: Store<IMirrorState>,
        private parent: DynamicComponent
    ) {
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }

    public ngOnInit(): void {
        this.store.select(selectPreviewMode)
            .pipe(takeUntil(this.destroy$))
            .subscribe(preview => {
                this.previewMode = preview;
                
            });
    }

}
