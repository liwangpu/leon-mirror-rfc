import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { IComponentRegistry } from '@cxist/mirror-core';
import { FormComponent } from '../components/form/form.component';

@Injectable()
export class ComponentRegistryService implements IComponentRegistry {

    public constructor(
        private cfr: ComponentFactoryResolver
    ) { }
    public generateComponentFactory(control: string): ComponentFactory<any> {
        switch (control) {
            case 'form':
                return this.cfr.resolveComponentFactory(FormComponent);
            // case 'flex-row-layout':
            //     return this.cfr.resolveComponentFactory(FlexRowLayoutComponent);
            default:
                return null;
        }
    }
}
