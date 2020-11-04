import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightModalDestination } from './flight-modal-destination.model';
import * as FlightModalDestinationActions from './flight-modal-destination.actions';

export const flightModalDestinationsFeatureKey = 'flightModalDestinations';

export interface State extends EntityState<FlightModalDestination> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FlightModalDestination> = createEntityAdapter<FlightModalDestination>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const flightModalDestinationReducer = createReducer(
  initialState,
  on(FlightModalDestinationActions.addFlightModalDestination,
    (state, action) => adapter.addOne(action.flightModalDestination, state)
  ),
  on(FlightModalDestinationActions.upsertFlightModalDestination,
    (state, action) => adapter.upsertOne(action.flightModalDestination, state)
  ),
  on(FlightModalDestinationActions.addFlightModalDestinations,
    (state, action) => adapter.addMany(action.flightModalDestinations, state)
  ),
  on(FlightModalDestinationActions.upsertFlightModalDestinations,
    (state, action) => adapter.upsertMany(action.flightModalDestinations, state)
  ),
  on(FlightModalDestinationActions.updateFlightModalDestination,
    (state, action) => adapter.updateOne(action.flightModalDestination, state)
  ),
  on(FlightModalDestinationActions.updateFlightModalDestinations,
    (state, action) => adapter.updateMany(action.flightModalDestinations, state)
  ),
  on(FlightModalDestinationActions.deleteFlightModalDestination,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FlightModalDestinationActions.deleteFlightModalDestinations,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FlightModalDestinationActions.loadFlightModalDestinations,
    (state, action) => adapter.addAll(action.flightModalDestinations, state)
  ),
  on(FlightModalDestinationActions.clearFlightModalDestinations,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return flightModalDestinationReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
