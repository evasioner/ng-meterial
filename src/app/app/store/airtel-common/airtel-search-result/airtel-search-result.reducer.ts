import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AirtelSearchResult } from './airtel-search-result.model';
import * as AirtelSearchResultActions from './airtel-search-result.actions';

export const airtelSearchResultsFeatureKey = 'airtelSearchResults';

export interface State extends EntityState<AirtelSearchResult> {
  // additional entities state properties
}

export const adapter: EntityAdapter<AirtelSearchResult> = createEntityAdapter<AirtelSearchResult>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const airtelSearchResultReducer = createReducer(
  initialState,
  on(AirtelSearchResultActions.addAirtelSearchResult,
    (state, action) => adapter.addOne(action.airtelSearchResult, state)
  ),
  on(AirtelSearchResultActions.upsertAirtelSearchResult,
    (state, action) => adapter.upsertOne(action.airtelSearchResult, state)
  ),
  on(AirtelSearchResultActions.addAirtelSearchResults,
    (state, action) => adapter.addMany(action.airtelSearchResults, state)
  ),
  on(AirtelSearchResultActions.upsertAirtelSearchResults,
    (state, action) => adapter.upsertMany(action.airtelSearchResults, state)
  ),
  on(AirtelSearchResultActions.updateAirtelSearchResult,
    (state, action) => adapter.updateOne(action.airtelSearchResult, state)
  ),
  on(AirtelSearchResultActions.updateAirtelSearchResults,
    (state, action) => adapter.updateMany(action.airtelSearchResults, state)
  ),
  on(AirtelSearchResultActions.deleteAirtelSearchResult,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(AirtelSearchResultActions.deleteAirtelSearchResults,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(AirtelSearchResultActions.loadAirtelSearchResults,
    (state, action) => adapter.addAll(action.airtelSearchResults, state)
  ),
  on(AirtelSearchResultActions.clearAirtelSearchResults,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return airtelSearchResultReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
