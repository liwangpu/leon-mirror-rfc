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
    private _buttonHandler: fromCore.IActionButtonHandler;
    private grade: string;
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

    protected get buttonHandler(): fromCore.IActionButtonHandler {
        if (!this._buttonHandler) {
            this._buttonHandler = this.injector.get(fromCore.ACTIONBUTTONHANDLER);
        }
        return this._buttonHandler;
    }

    public async ngOnInit(): Promise<void> {
        // this.query();
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

    public async edit(data: any, button: fromCore.IActionButton): Promise<void> {
        this.publishScopeData(data);
        this.buttonHandler.onClick(button);
    }

    public async filterParameterChange(data: { [key: string]: any; }): Promise<void> {
        // console.log('grid get filter data', data);
        if (data) {
            this.grade = data.grade;
        }
        this.query();
    }

    private query() {
        this.resourceDataStore.query(this.dataSourceKey, { grade: this.grade }).subscribe(res => this.datas = res.items);
    }

}
