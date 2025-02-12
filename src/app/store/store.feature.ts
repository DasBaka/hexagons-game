import * as states from './store.interfaces';

import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

/** Defines the structure for updating a specific key in the store state with a new value. */
interface IUpdatePayload<K extends keyof states.IState> {
  key: K;
  value: states.IState[K];
}

/** Creates an NgRx action for updating the store with a payload containing a key from IState and its corresponding new value. */
export const updateStore = createAction('[Store] Update', props<IUpdatePayload<keyof states.IState>>());

/** Creates an NgRx feature that encapsulates the store's name and reducer, handling state updates based on the updateStore action. */
export const storeFeature = createFeature({
  name: 'store',
  reducer: createReducer(
    states.initialState,
    on(updateStore, (state, { key, value }) => ({ ...state, [key]: value }))
  )
});

/** Destructures and exports the name and reducer from the storeFeature for use in other parts of the application. */
export const { name: featureKey, reducer: featureReducer } = storeFeature;
