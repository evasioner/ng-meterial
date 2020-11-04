import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightSearchResult } from './flight-search-result.model';
import * as FlightSearchResultActions from './flight-search-result.actions';

export const flightSearchResultsFeatureKey = 'flightSearchResults';

export interface State extends EntityState<FlightSearchResult> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FlightSearchResult> = createEntityAdapter<FlightSearchResult>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const flightSearchResultReducer = createReducer(
  initialState,
  on(FlightSearchResultActions.addFlightSearchResult,
    (state, action) => adapter.addOne(action.flightSearchResult, state)
  ),
  on(FlightSearchResultActions.upsertFlightSearchResult,
    (state, action) => adapter.upsertOne(action.flightSearchResult, state)
  ),
  on(FlightSearchResultActions.addFlightSearchResults,
    (state, action) => adapter.addMany(action.flightSearchResults, state)
  ),
  on(FlightSearchResultActions.upsertFlightSearchResults,
    (state, action) => adapter.upsertMany(action.flightSearchResults, state)
  ),
  on(FlightSearchResultActions.updateFlightSearchResult,
    (state, action) => adapter.updateOne(action.flightSearchResult, state)
  ),
  on(FlightSearchResultActions.updateFlightSearchResults,
    (state, action) => adapter.updateMany(action.flightSearchResults, state)
  ),
  on(FlightSearchResultActions.deleteFlightSearchResult,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FlightSearchResultActions.deleteFlightSearchResults,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FlightSearchResultActions.loadFlightSearchResults,
    (state, action) => adapter.addAll(action.flightSearchResults, state)
  ),
  on(FlightSearchResultActions.clearFlightSearchResults,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return flightSearchResultReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
