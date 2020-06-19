import { Injectable, Injector } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import * as fromOrion from '@byzan/orion2';
import { DynamicModalComponent } from '@cxist/mirror-shared';

@Injectable()
export class ActionButtonHandlerService implements fromCore.IActionButtonHandler {

    private _dialogSrv: fromOrion.DynamicDialogService;
    private _componentDiscoverySrv: fromCore.IComponentDiscovery;
    private _componentDesignDataStore: fromCore.IComponentDesignDataStore;
    public constructor(
        private injector: Injector
    ) { }

    protected get dialogSrv(): fromOrion.DynamicDialogService {
        if (!this._dialogSrv) {
            this._dialogSrv = this.injector.get(fromOrion.DynamicDialogService);
        }
        return this._dialogSrv;
    }

    protected get componentDiscoverySrv(): fromCore.IComponentDiscovery {
        if (!this._componentDiscoverySrv) {
            this._componentDiscoverySrv = this.injector.get(fromCore.COMPONENTDISCOVERY);
        }
        return this._componentDiscoverySrv;
    }

    protected get componentDesignDataStore(): fromCore.IComponentDesignDataStore {
        if (!this._componentDesignDataStore) {
            this._componentDesignDataStore = this.injector.get(fromCore.COMPONENTDESIGNDATASTORE);
        }
        return this._componentDesignDataStore;
    }

    public async onClick(button: fromCore.IActionButton): Promise<void> {

        if (button.type === 'dialog') { return await this.handlerDialog(button); }



        console.log('finished', button);
    }

    private async handlerDialog(button: fromCore.IActionButton): Promise<void> {
        if (!button.target) {
            console.warn(`button类型为dialog,但是却没有定义target,请检查`, button);
            return;
        }

        // let metaData = await this.componentDesignDataStore.getMetaData(button.target).toPromise();
        let data = { key: button.target, parameters: button.parameters };
        this.dialogSrv.open(DynamicModalComponent, { width: '600px', height: '400px', data });
        // let fac = await this.componentDiscoverySrv.generateComponentFactory(metaData.control);

        // console.log('button click', fac, button);
    }
}
