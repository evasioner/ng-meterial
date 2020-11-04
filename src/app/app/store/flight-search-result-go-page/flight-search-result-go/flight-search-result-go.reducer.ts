import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightSearchResultGo } from './flight-search-result-go.model';
import * as FlightSearchResultGoActions from './flight-search-result-go.actions';

export const flightSearchResultGoesFeatureKey = 'flightSearchResultGoes';

export interface State extends EntityState<FlightSearchResultGo> {
  // additional entities state properties
}

export const adapter: EntityAdapter<FlightSearchResultGo> = createEntityAdapter<FlightSearchResultGo>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const flightSearchResultGoReducer = createReducer(
  initialState,
  on(FlightSearchResultGoActions.addFlightSearchResultGo,
    (state, action) => adapter.addOne(action.flightSearchResultGo, state)
  ),
  on(FlightSearchResultGoActions.upsertFlightSearchResultGo,
    (state, action) => adapter.upsertOne(action.flightSearchResultGo, state)
  ),
  on(FlightSearchResultGoActions.addFlightSearchResultGos,
    (state, action) => adapter.addMany(action.flightSearchResultGos, state)
  ),
  on(FlightSearchResultGoActions.upsertFlightSearchResultGos,
    (state, action) => adapter.upsertMany(action.flightSearchResultGos, state)
  ),
  on(FlightSearchResultGoActions.updateFlightSearchResultGo,
    (state, action) => adapter.updateOne(action.flightSearchResultGo, state)
  ),
  on(FlightSearchResultGoActions.updateFlightSearchResultGos,
    (state, action) => adapter.updateMany(action.flightSearchResultGos, state)
  ),
  on(FlightSearchResultGoActions.deleteFlightSearchResultGo,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(FlightSearchResultGoActions.deleteFlightSearchResultGos,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(FlightSearchResultGoActions.loadFlightSearchResultGos,
    (state, action) => adapter.addAll(action.flightSearchResultGos, state)
  ),
  on(FlightSearchResultGoActions.clearFlightSearchResultGos,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return flightSearchResultGoReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
