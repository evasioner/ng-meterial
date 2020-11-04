import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AirtelResultSearch } from './airtel-result-main-search.model';
import * as AirtelResultMainSearchActions from './airtel-result-main-search.actions';

export const airtelResultMainSearchesFeatureKey = 'airtelResultMainSearches';

export interface State extends EntityState<AirtelResultSearch> {
  // additional entities state properties
}

export const adapter: EntityAdapter<AirtelResultSearch> = createEntityAdapter<AirtelResultSearch>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const airtelResultMainSearchReducer = createReducer(
  initialState,
  on(AirtelResultMainSearchActions.addAirtelResultMainSearch,
    (state, action) => adapter.addOne(action.airtelResultMainSearch, state)
  ),
  on(AirtelResultMainSearchActions.upsertAirtelResultMainSearch,
    (state, action) => adapter.upsertOne(action.airtelResultMainSearch, state)
  ),
  on(AirtelResultMainSearchActions.addAirtelResultMainSearchs,
    (state, action) => adapter.addMany(action.airtelResultMainSearchs, state)
  ),
  on(AirtelResultMainSearchActions.upsertAirtelResultMainSearchs,
    (state, action) => adapter.upsertMany(action.airtelResultMainSearchs, state)
  ),
  on(AirtelResultMainSearchActions.updateAirtelResultMainSearch,
    (state, action) => adapter.updateOne(action.airtelResultMainSearch, state)
  ),
  on(AirtelResultMainSearchActions.updateAirtelResultMainSearchs,
    (state, action) => adapter.updateMany(action.airtelResultMainSearchs, state)
  ),
  on(AirtelResultMainSearchActions.deleteAirtelResultMainSearch,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(AirtelResultMainSearchActions.deleteAirtelResultMainSearchs,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(AirtelResultMainSearchActions.loadAirtelResultMainSearchs,
    (state, action) => adapter.addAll(action.airtelResultMainSearchs, state)
  ),
  on(AirtelResultMainSearchActions.clearAirtelResultMainSearchs,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return airtelResultMainSearchReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
