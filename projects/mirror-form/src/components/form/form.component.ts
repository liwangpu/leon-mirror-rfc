import { Component, OnInit, forwardRef, Injector, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as faker from 'faker';
import { map } from 'rxjs/operators';

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
export class FormComponent extends fromCore.DynamicComponent implements OnInit, fromCore.IInitialize, fromCore.IDataSource {

    public form: FormGroup;
    public grades: Array<any>;
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
            grade: [],
            address: [],
            remark: []
        });
    }

    public async ngOnInit(): Promise<void> {
        this.grades = await this.resourceDataStore.query('grade').pipe(map(res => res.items.map(x => ({ label: x.name, value: x.id })))).toPromise();
    }

    public async onResourceChange(ids?: string[]): Promise<void> {

    }

    public async createResource(entity: { [key: string]: any }): Promise<string> {
        let data = await this.resourceDataStore.create(this.dataSourceKey, entity).toPromise();
        return data.id;
    }

    public async updateResource(entity: { id: string, [key: string]: any }): Promise<void> {
        await this.resourceDataStore.patch(this.dataSourceKey, entity.id, entity).toPromise();
    }

    public async deleteResource(id: string): Promise<void> {

    }

    public async InitialParameterChange(data: { [key: string]: any; }): Promise<void> {
        // console.log('form get initialize data', data);
        if (data.id) {
            let entity = await this.resourceDataStore.get(this.dataSourceKey, data.id).toPromise();
            data = { ...entity, ...data };
        }
        this.form.patchValue(data);
    }

    public async save(): Promise<void> {
        let data = this.form.value;
        // console.log('data', data);
        if (!data.id) {
            this.createResource(data);
            return;
        }

        await this.updateResource(data);
    }

    public randomStudent(): void {
        let gradeIdx = faker.random.number({ min: 1, max: 3 });
        let s = {
            id: null,
            name: faker.commerce.productName(),
            age: faker.random.number({ min: 12, max: 14 }),
            grade: this.grades[gradeIdx - 1].value,
            address: faker.address.streetAddress(),
            remark: faker.lorem.words()
        };
        this.form.patchValue(s);
    }
}

