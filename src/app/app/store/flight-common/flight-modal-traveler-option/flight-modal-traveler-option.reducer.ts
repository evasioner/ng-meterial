import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightModalTravelerOption } from './flight-modal-traveler-option.model';
import * as FlightModalTravelerOptionActions from './flight-modal-traveler-option.actions';

export const flightModalTravelerOptionsFeatureKey = 'flightModalTravelerOptions';

export interface State extends EntityState<FlightModalTravelerOption> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FlightModalTravelerOption> = createEntityAdapter<FlightModalTravelerOption>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const flightModalTravelerOptionReducer = createReducer(
  initialState,
  on(FlightModalTravelerOptionActions.addFlightModalTravelerOption,
    (state, action) => adapter.addOne(action.flightModalTravelerOption, state)
  ),
  on(FlightModalTravelerOptionActions.upsertFlightModalTravelerOption,
    (state, action) => adapter.upsertOne(action.flightModalTravelerOption, state)
  ),
  on(FlightModalTravelerOptionActions.addFlightModalTravelerOptions,
    (state, action) => adapter.addMany(action.flightModalTravelerOptions, state)
  ),
  on(FlightModalTravelerOptionActions.upsertFlightModalTravelerOptions,
    (state, action) => adapter.upsertMany(action.flightModalTravelerOptions, state)
  ),
  on(FlightModalTravelerOptionActions.updateFlightModalTravelerOption,
    (state, action) => adapter.updateOne(action.flightModalTravelerOption, state)
  ),
  on(FlightModalTravelerOptionActions.updateFlightModalTravelerOptions,
    (state, action) => adapter.updateMany(action.flightModalTravelerOptions, state)
  ),
  on(FlightModalTravelerOptionActions.deleteFlightModalTravelerOption,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FlightModalTravelerOptionActions.deleteFlightModalTravelerOptions,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FlightModalTravelerOptionActions.loadFlightModalTravelerOptions,
    (state, action) => adapter.addAll(action.flightModalTravelerOptions, state)
  ),
  on(FlightModalTravelerOptionActions.clearFlightModalTravelerOptions,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return flightModalTravelerOptionReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
