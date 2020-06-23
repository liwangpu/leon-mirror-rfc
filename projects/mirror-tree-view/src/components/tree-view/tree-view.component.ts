import { Component, OnInit, forwardRef, Injector } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';

@Component({
    selector: 'mirror-tree-view',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss'],
    providers: [
        {
            provide: fromCore.DynamicComponent,
            useExisting: forwardRef(() => TreeViewComponent)
        }
    ]
})
export class TreeViewComponent extends fromCore.DynamicComponent implements OnInit, fromCore.IDataSource {

    public grades: Array<any>;
    public selectId: string;
    private _buttonHandler: fromCore.IActionButtonHandler;
    private _resourceDataStore: fromCore.IResourceDataStore;
    constructor(
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

    public async onResourceChange(ids?: string[]): Promise<void> {
        this.query();
    }

    public async createResource(entity: { [key: string]: any; }): Promise<string> {
        return null;
    }

    public async updateResource(entity: { [key: string]: any; id: string; }): Promise<void> {

    }

    public async deleteResource(id: string): Promise<void> {

    }

    public async ngOnInit(): Promise<void> {
        this.query();
    }

    public onSelect(data: any): void {
        this.selectId = data.id;

        let scope = {};
        fromCore.assignScopeByNotify(scope, data, this.notify.filter(x => x.type === 'select')[0]);
        this.publishScopeData(scope);
    }

    public onEdit(data: any, button: fromCore.IActionButton): void {
        let scope = {};
        fromCore.assignScopeByNotify(scope, data, this.notify.filter(x => x.type === 'edit')[0]);
        this.publishScopeData(scope);
        this.buttonHandler.onClick(button);
    }

    private query(): void {
        this.resourceDataStore.query(this.dataSourceKey).subscribe(res => {

            this.grades = res.items;
            this.grades.unshift({
                id: null,
                remark: '全部'
            });
            if (!this.selectId) {
                this.onSelect(this.grades[0]);
            }

        });
    }

}
