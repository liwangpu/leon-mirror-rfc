import { Component, OnInit, Inject, Optional, ViewChild, ViewContainerRef, Injector } from '@angular/core';
import { DIALOG_DATA, DynamicDialogRef } from '@byzan/orion2';
import * as fromCore from '@cxist/mirror-core';

@Component({
    selector: 'mirror-dynamic-modal',
    templateUrl: './dynamic-modal.component.html',
    styleUrls: ['./dynamic-modal.component.scss']
})
export class DynamicModalComponent implements OnInit {

    @ViewChild('container', { static: true, read: ViewContainerRef })
    public container: ViewContainerRef;
    public constructor(
        public ref: DynamicDialogRef<DynamicModalComponent>,
        @Inject(fromCore.COMPONENTDISCOVERY) private componentDiscoverySrv: fromCore.IComponentDiscovery,
        @Inject(fromCore.COMPONENTDESIGNDATASTORE) private componentDesignDataStore: fromCore.IComponentDesignDataStore,
        private injector: Injector,
        @Inject(DIALOG_DATA) private data?: { key: string, parameters: { [key: string]: any } }
    ) {
        // console.log(1, this.componentDiscoverySrv, this.componentDesignDataStore);
    }

    public async ngOnInit(): Promise<void> {
        if (!this.data) { return; }
        let metaData = await this.componentDesignDataStore.getMetaData(this.data.key).toPromise();
        let fac = this.componentDiscoverySrv.generateComponentFactory(metaData.control);
        if (!fac) {
            console.error(`组件库里面没有找到control为${metaData.control}的组件,请检查是否注册或者写错`, metaData);
            return;
        }
        const ij = Injector.create([
            {
                provide: fromCore.COMPONENTMETADATA,
                useValue: metaData
            }
        ], this.injector);
        this.container.createComponent(fac, null, ij);
    }

}
