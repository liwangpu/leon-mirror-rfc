import { Component, Injector, Inject } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { take } from 'rxjs/operators';

@Component({
    selector: 'mirror-action-button',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent {

    private _handler: fromCore.IActionButtonHandler;
    private _stateStore: fromCore.StateStoreService;
    public constructor(
        @Inject(fromCore.ACTIONBUTTONMETADATA) public buttons: Array<fromCore.IActionButton>,
        private injector: Injector
    ) { }

    protected get handler(): fromCore.IActionButtonHandler {
        if (!this._handler) {
            this._handler = this.injector.get(fromCore.ACTIONBUTTONHANDLER);
        }
        return this._handler;
    }

    protected get stateStore(): fromCore.StateStoreService {
        if (!this._stateStore) {
            this._stateStore = this.injector.get(fromCore.StateStoreService);
        }
        return this._stateStore;
    }

    public async onClick(btn: fromCore.IActionButton): Promise<void> {
        let button = fromCore.ObjectTool.deepCopy(btn);
        let scope = await this.stateStore.getScopeDataSnapshot();
        if (button.parameters) {
            button.parameters = fromCore.ExpressionTranslator.translateStaticVariableExpression(button.parameters, scope);
        }
        await this.handler.onClick(button);
    }
}
