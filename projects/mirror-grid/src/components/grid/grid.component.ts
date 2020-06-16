import { Component, OnInit, AfterViewInit, OnDestroy, Injector, forwardRef } from '@angular/core';
import { DynamicComponent } from '@cxist/mirror-core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'mirror-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        {
            provide: DynamicComponent,
            useExisting: forwardRef(() => GridComponent)
        }
    ]
})
export class GridComponent extends DynamicComponent implements AfterViewInit, OnDestroy {

    public form: FormGroup;
    public constructor(
        injector: Injector,
        fb: FormBuilder
    ) {
        super(injector);
        this.form = fb.group({
            name: ['Leon'],
            age: [18]
        });
    }

    public async ngAfterViewInit(): Promise<void> {

    }

    public async ngOnDestroy(): Promise<void> {

    }

    public updateName(): void {
        let data = this.form.value;
        this.publishValueChange({ name: data.name });
    }

    public updateAge(): void {
        let data = this.form.value;
        this.publishValueChange({ age: data.age });
    }

    public update(): void {
        let data = this.form.value;
        this.publishValueChange(data);
    }

}
