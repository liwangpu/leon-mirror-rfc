import { Component, OnInit, forwardRef, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { DynamicComponent, IInitializable } from '@cxist/mirror-core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'mirror-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    providers: [
        {
            provide: DynamicComponent,
            useExisting: forwardRef(() => FormComponent)
        }
    ]
})
export class FormComponent extends DynamicComponent implements OnDestroy, IInitializable {

    public form: FormGroup;
    public constructor(
        injector: Injector,
        fb: FormBuilder
    ) {
        super(injector);
        this.form = fb.group({
            name: [],
            age: [],
            remark: []
        });
    }

    public async ngOnDestroy(): Promise<void> {

    }

    public async InitialParameterChange(data: { [key: string]: any; }): Promise<void> {
        console.log('form get initialize data', data);
        this.form.patchValue(data);
    }

}

