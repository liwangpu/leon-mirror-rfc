import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { IComponentRegistry } from '@cxist/mirror-core';
import * as fromComponent from '../components';

@Injectable()
export class ComponentRegistryService implements IComponentRegistry {

    public constructor(
        private cfr: ComponentFactoryResolver
    ) { }
    public generateComponentFactory(control: string): ComponentFactory<any> {
        switch (control) {
            case 'blank-layout':
                return this.cfr.resolveComponentFactory(fromComponent.BlankLayoutComponent);
            case 'three-column-layout':
                return this.cfr.resolveComponentFactory(fromComponent.ThreeColumnLayoutComponent);
            default:
                return null;
        }
    }
}
