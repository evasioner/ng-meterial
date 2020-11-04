import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightSearchResultCome } from './flight-search-result-come.model';
import * as FlightSearchResultComeActions from './flight-search-result-come.actions';

export const flightSearchResultComesFeatureKey = 'flightSearchResultComes';

export interface State extends EntityState<FlightSearchResultCome> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FlightSearchResultCome> = createEntityAdapter<FlightSearchResultCome>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const flightSearchResultComeReducer = createReducer(
  initialState,
  on(FlightSearchResultComeActions.addFlightSearchResultCome,
    (state, action) => adapter.addOne(action.flightSearchResultCome, state)
  ),
  on(FlightSearchResultComeActions.upsertFlightSearchResultCome,
    (state, action) => adapter.upsertOne(action.flightSearchResultCome, state)
  ),
  on(FlightSearchResultComeActions.addFlightSearchResultComes,
    (state, action) => adapter.addMany(action.flightSearchResultComes, state)
  ),
  on(FlightSearchResultComeActions.upsertFlightSearchResultComes,
    (state, action) => adapter.upsertMany(action.flightSearchResultComes, state)
  ),
  on(FlightSearchResultComeActions.updateFlightSearchResultCome,
    (state, action) => adapter.updateOne(action.flightSearchResultCome, state)
  ),
  on(FlightSearchResultComeActions.updateFlightSearchResultComes,
    (state, action) => adapter.updateMany(action.flightSearchResultComes, state)
  ),
  on(FlightSearchResultComeActions.deleteFlightSearchResultCome,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FlightSearchResultComeActions.deleteFlightSearchResultComes,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FlightSearchResultComeActions.loadFlightSearchResultComes,
    (state, action) => adapter.addAll(action.flightSearchResultComes, state)
  ),
  on(FlightSearchResultComeActions.clearFlightSearchResultComes,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return flightSearchResultComeReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
