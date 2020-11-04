import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { RentMainSearch } from './rent-main-search.model';
import * as RentMainSearchActions from './rent-main-search.actions';

export const rentMainSearchesFeatureKey = 'rentMainSearches';

export interface State extends EntityState<RentMainSearch> {
  // additional entities state properties
}

export const adapter: EntityAdapter<RentMainSearch> = createEntityAdapter<RentMainSearch>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const rentMainSearchReducer = createReducer(
  initialState,
  on(RentMainSearchActions.addRentMainSearch,
    (state, action) => adapter.addOne(action.rentMainSearch, state)
  ),
  on(RentMainSearchActions.upsertRentMainSearch,
    (state, action) => adapter.upsertOne(action.rentMainSearch, state)
  ),
  on(RentMainSearchActions.addRentMainSearchs,
    (state, action) => adapter.addMany(action.rentMainSearchs, state)
  ),
  on(RentMainSearchActions.upsertRentMainSearchs,
    (state, action) => adapter.upsertMany(action.rentMainSearchs, state)
  ),
  on(RentMainSearchActions.updateRentMainSearch,
    (state, action) => adapter.updateOne(action.rentMainSearch, state)
  ),
  on(RentMainSearchActions.updateRentMainSearchs,
    (state, action) => adapter.updateMany(action.rentMainSearchs, state)
  ),
  on(RentMainSearchActions.deleteRentMainSearch,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(RentMainSearchActions.deleteRentMainSearchs,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(RentMainSearchActions.loadRentMainSearchs,
    (state, action) => adapter.addAll(action.rentMainSearchs, state)
  ),
  on(RentMainSearchActions.clearRentMainSearchs,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return rentMainSearchReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
