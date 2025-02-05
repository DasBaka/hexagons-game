import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';
import * as states from './store.interfaces';

// Define a type for the update payload
interface UpdatePayload<K extends keyof states.State> {
  key: K;
  value: states.State[K];
}

export const updateStore = createAction('[Store] Update', props<UpdatePayload<keyof states.State>>());

export const storeFeature = createFeature({
  name: 'store',
  reducer: createReducer(
    states.initialState,
    on(updateStore, (state, { key, value }) => ({ ...state, [key]: value }))
  )
});

export const { name: featureKey, reducer: featureReducer } = storeFeature;
