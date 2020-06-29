import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { stateStoreKey } from './state';
import { stateReducer } from './reducer';
import { StateStoreService } from './state-store.service';

@NgModule({
    imports: [
        StoreModule.forFeature(stateStoreKey, stateReducer),
    ],
    providers: [
        StateStoreService
    ]
})
export class StateStoreModule { }
