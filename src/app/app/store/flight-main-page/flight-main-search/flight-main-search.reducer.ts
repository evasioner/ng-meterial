import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightMainSearch } from './flight-main-search.model';
import * as FlightMainSearchActions from './flight-main-search.actions';

export const flightMainSearchesFeatureKey = 'flightMainSearches';

export interface State extends EntityState<FlightMainSearch> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FlightMainSearch> = createEntityAdapter<FlightMainSearch>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const flightMainSearchReducer = createReducer(
  initialState,
  on(FlightMainSearchActions.addFlightMainSearch,
    (state, action) => adapter.addOne(action.flightMainSearch, state)
  ),
  on(FlightMainSearchActions.upsertFlightMainSearch,
    (state, action) => adapter.upsertOne(action.flightMainSearch, state)
  ),
  on(FlightMainSearchActions.addFlightMainSearchs,
    (state, action) => adapter.addMany(action.flightMainSearchs, state)
  ),
  on(FlightMainSearchActions.upsertFlightMainSearchs,
    (state, action) => adapter.upsertMany(action.flightMainSearchs, state)
  ),
  on(FlightMainSearchActions.updateFlightMainSearch,
    (state, action) => adapter.updateOne(action.flightMainSearch, state)
  ),
  on(FlightMainSearchActions.updateFlightMainSearchs,
    (state, action) => adapter.updateMany(action.flightMainSearchs, state)
  ),
  on(FlightMainSearchActions.deleteFlightMainSearch,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FlightMainSearchActions.deleteFlightMainSearchs,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FlightMainSearchActions.loadFlightMainSearchs,
    (state, action) => adapter.addAll(action.flightMainSearchs, state)
  ),
  on(FlightMainSearchActions.clearFlightMainSearchs,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return flightMainSearchReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
