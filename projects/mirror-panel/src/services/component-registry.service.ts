import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { IComponentRegistry } from '@cxist/mirror-core';
import { TabComponent } from '../components/tab/tab.component';
import { ActionButtonComponent } from '../components/action-button/action-button.component';

@Injectable()
export class ComponentRegistryService implements IComponentRegistry {

    public constructor(
        private cfr: ComponentFactoryResolver
    ) { }
    public generateComponentFactory(control: string): ComponentFactory<any> {
        switch (control) {
            case 'tab':
                return this.cfr.resolveComponentFactory(TabComponent);
            case 'action-button':
                return this.cfr.resolveComponentFactory(ActionButtonComponent);
            default:
                return null;
        }
    }
}
