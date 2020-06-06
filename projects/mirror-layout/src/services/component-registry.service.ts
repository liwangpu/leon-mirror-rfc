import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { IComponentRegistry } from '@cxist/mirror-core';
import { BlankLayoutComponent } from '../components/blank-layout/blank-layout.component';

@Injectable()
export class ComponentRegistryService implements IComponentRegistry {

    public constructor(
        private cfr: ComponentFactoryResolver
    ) { }
    public generateComponentFactory(control: string): ComponentFactory<any> {
        switch (control) {
            case 'blank-layout':
                return this.cfr.resolveComponentFactory(BlankLayoutComponent);
            // case 'flex-row-layout':
            //     return this.cfr.resolveComponentFactory(FlexRowLayoutComponent);
            default:
                return null;
        }
    }
}
