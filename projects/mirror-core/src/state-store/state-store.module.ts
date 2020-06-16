import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { stateStoreKey } from './state';
import { stateReducer } from './reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(stateStoreKey, stateReducer),
  ]
})
export class StateStoreModule { }
