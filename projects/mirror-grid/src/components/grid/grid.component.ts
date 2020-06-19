import { Component, Injector, forwardRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';

@Component({
    selector: 'mirror-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        {
            provide: fromCore.DynamicComponent,
            useExisting: forwardRef(() => GridComponent)
        }
    ]
})
export class GridComponent extends fromCore.DynamicComponent implements OnInit, fromCore.IFilter, fromCore.IDataSource {

    public datas: Array<any>;
    @fromCore.DyContainer('button')
    @ViewChild('button', { static: true, read: ViewContainerRef })
    public button: ViewContainerRef;
    private _resourceDataStore: fromCore.IResourceDataStore;
    public constructor(
        injector: Injector
    ) {
        super(injector);
    }

    protected get resourceDataStore(): fromCore.IResourceDataStore {
        if (!this._resourceDataStore) {
            this._resourceDataStore = this.injector.get(fromCore.RESOURCEDATASTORE);
        }
        return this._resourceDataStore;
    }

    public async ngOnInit(): Promise<void> {
        this.query();
        await this.renderChildrent();
    }

    public async onResourceChange(ids?: string[]): Promise<void> {
        // console.log('grid get resource change', ids);
        this.query();
    }

    public async createResource(entity: { [key: string]: any }): Promise<string> {
        return null;
    }

    public async updateResource(entity: { id: string, [key: string]: any }): Promise<void> {

    }

    public async deleteResource(id: string,): Promise<void> {

    }

    public async onNotify(notify: fromCore.INotification): Promise<void> {
        console.log('grid get event', notify);
    }

    public async filterParameterChange(data: { [key: string]: any; }): Promise<void> {
        console.log('grid get filter data', data);
    }

    private query() {
        this.resourceDataStore.query(this.dataSourceKey).subscribe(res => this.datas = res.items);
    }

}
