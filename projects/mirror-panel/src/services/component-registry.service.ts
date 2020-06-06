import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { IComponentRegistry } from '@cxist/mirror-core';
import { TabComponent } from '../components/tab/tab.component';

@Injectable()
export class ComponentRegistryService implements IComponentRegistry {

    public constructor(
        private cfr: ComponentFactoryResolver
    ) { }
    public generateComponentFactory(control: string): ComponentFactory<any> {
        switch (control) {
            case 'tab':
                return this.cfr.resolveComponentFactory(TabComponent);
            // case 'flex-row-layout':
            //     return this.cfr.resolveComponentFactory(FlexRowLayoutComponent);
            default:
                return null;
        }
    }
}
