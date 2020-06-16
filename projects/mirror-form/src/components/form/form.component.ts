import { Component, OnInit, forwardRef, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { DynamicComponent, IInitialization } from '@cxist/mirror-core';
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
export class FormComponent extends DynamicComponent implements AfterViewInit, OnDestroy, IInitialization {

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
    public parameters: { [key: string]: any; } = { name: '{{name}}', age: '{{age}}', remark: '天天开心' };

    public async ngAfterViewInit(): Promise<void> {
     
    }

    public async ngOnDestroy(): Promise<void> {
     
    }

    public async initialize(data: { [key: string]: any; }): Promise<void> {
        console.log('form get initialize data', data);
        this.form.patchValue(data);
    }
}

