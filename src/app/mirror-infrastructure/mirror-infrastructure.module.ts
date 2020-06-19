import { NgModule } from '@angular/core';
import { MirrorModule, ActionButtonHandlerService } from '@cxist/mirror';
import * as fromCore from '@cxist/mirror-core';

@NgModule({
    declarations: [],
    imports: [
        MirrorModule
    ],
    providers: [
        ActionButtonHandlerService,
        {
            provide: fromCore.ACTIONBUTTONHANDLER,
            useExisting: ActionButtonHandlerService
        }
    ]
})
export class MirrorInfrastructureModule { }
