import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AirtelModalTravelerOption } from './airtel-modal-traveler-option.model';
import * as AirtelModalTravelerOptionActions from './airtel-modal-traveler-option.actions';

export const airtelModalTravelerOptionsFeatureKey = 'airtelModalTravelerOptions';

export interface State extends EntityState<AirtelModalTravelerOption> {
  // additional entities state properties
}

export const adapter: EntityAdapter<AirtelModalTravelerOption> = createEntityAdapter<AirtelModalTravelerOption>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const airtelModalTravelerOptionReducer = createReducer(
  initialState,
  on(AirtelModalTravelerOptionActions.addAirtelModalTravelerOption,
    (state, action) => adapter.addOne(action.airtelModalTravelerOption, state)
  ),
  on(AirtelModalTravelerOptionActions.upsertAirtelModalTravelerOption,
    (state, action) => adapter.upsertOne(action.airtelModalTravelerOption, state)
  ),
  on(AirtelModalTravelerOptionActions.addAirtelModalTravelerOptions,
    (state, action) => adapter.addMany(action.airtelModalTravelerOptions, state)
  ),
  on(AirtelModalTravelerOptionActions.upsertAirtelModalTravelerOptions,
    (state, action) => adapter.upsertMany(action.airtelModalTravelerOptions, state)
  ),
  on(AirtelModalTravelerOptionActions.updateAirtelModalTravelerOption,
    (state, action) => adapter.updateOne(action.airtelModalTravelerOption, state)
  ),
  on(AirtelModalTravelerOptionActions.updateAirtelModalTravelerOptions,
    (state, action) => adapter.updateMany(action.airtelModalTravelerOptions, state)
  ),
  on(AirtelModalTravelerOptionActions.deleteAirtelModalTravelerOption,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(AirtelModalTravelerOptionActions.deleteAirtelModalTravelerOptions,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(AirtelModalTravelerOptionActions.loadAirtelModalTravelerOptions,
    (state, action) => adapter.addAll(action.airtelModalTravelerOptions, state)
  ),
  on(AirtelModalTravelerOptionActions.clearAirtelModalTravelerOptions,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return airtelModalTravelerOptionReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
