import { Component, OnInit, forwardRef, Injector, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as faker from 'faker';

@Component({
    selector: 'mirror-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    providers: [
        {
            provide: fromCore.DynamicComponent,
            useExisting: forwardRef(() => FormComponent)
        }
    ]
})
export class FormComponent extends fromCore.DynamicComponent implements OnDestroy, fromCore.IInitialize, fromCore.IDataSource {

    public form: FormGroup;
    public constructor(
        @Inject(fromCore.RESOURCEDATASTORE) private resourceDataStore: fromCore.IResourceDataStore,
        injector: Injector,
        fb: FormBuilder
    ) {
        super(injector);
        this.form = fb.group({
            id: [],
            name: [],
            age: [],
            address: [],
            remark: []
        });
    }

    public async onResourceChange(ids?: string[]): Promise<void> {

    }

    public async createResource(entity: { [key: string]: any }): Promise<string> {
        let data = await this.resourceDataStore.create(this.dataSourceKey, entity).toPromise();
        return data.id;
    }

    public async updateResource(entity: { id: string, [key: string]: any }): Promise<void> {

    }

    public async deleteResource(id: string): Promise<void> {

    }

    public async ngOnDestroy(): Promise<void> {

    }

    public async InitialParameterChange(data: { [key: string]: any; }): Promise<void> {
        console.log('form get initialize data', data);
        this.form.patchValue(data);
    }

    public async save(): Promise<void> {
        let data = this.form.value;
        console.log('data', data);
        if (!data.id) {
            this.createResource(data);
            return;
        }

        this.updateResource(data);
    }

    public randomStudent(): void {
        let s = {
            name: faker.commerce.productName(),
            age: faker.random.number({ min: 8, max: 30 }),
            address: faker.address.streetAddress(),
            remark: faker.lorem.words()
        };
        this.form.patchValue(s);
    }
}

