import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { IComponentRegistry } from '@cxist/mirror-core';
import { GridComponent } from '../components/grid/grid.component';

@Injectable()
export class ComponentRegistryService implements IComponentRegistry {

    public constructor(
        private cfr: ComponentFactoryResolver
    ) { }
    public generateComponentFactory(control: string): ComponentFactory<any> {
        switch (control) {
            case 'grid':
                return this.cfr.resolveComponentFactory(GridComponent);
            // case 'flex-row-layout':
            //     return this.cfr.resolveComponentFactory(FlexRowLayoutComponent);
            default:
                return null;
        }
    }
}
