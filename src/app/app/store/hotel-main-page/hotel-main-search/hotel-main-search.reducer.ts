import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelMainSearch } from './hotel-main-search.model';
import * as HotelMainSearchActions from './hotel-main-search.actions';

export const hotelMainSearchesFeatureKey = 'hotelMainSearches';

export interface State extends EntityState<HotelMainSearch> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelMainSearch> = createEntityAdapter<HotelMainSearch>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelMainSearchReducer = createReducer(
  initialState,
  on(HotelMainSearchActions.addHotelMainSearch,
    (state, action) => adapter.addOne(action.hotelMainSearch, state),
  ),
  on(HotelMainSearchActions.upsertHotelMainSearch,
    (state, action) => adapter.upsertOne(action.hotelMainSearch, state),
  ),
  on(HotelMainSearchActions.addHotelMainSearchs,
    (state, action) => adapter.addMany(action.hotelMainSearchs, state),
  ),
  on(HotelMainSearchActions.upsertHotelMainSearchs,
    (state, action) => adapter.upsertMany(action.hotelMainSearchs, state),
  ),
  on(HotelMainSearchActions.updateHotelMainSearch,
    (state, action) => adapter.updateOne(action.hotelMainSearch, state),
  ),
  on(HotelMainSearchActions.updateHotelMainSearchs,
    (state, action) => adapter.updateMany(action.hotelMainSearchs, state),
  ),
  on(HotelMainSearchActions.deleteHotelMainSearch,
    (state, action) => adapter.removeOne(action.id, state),
  ),
  on(HotelMainSearchActions.deleteHotelMainSearchs,
    (state, action) => adapter.removeMany(action.ids, state),
  ),
  on(HotelMainSearchActions.loadHotelMainSearchs,
    (state, action) => adapter.addAll(action.hotelMainSearchs, state),
  ),
  on(HotelMainSearchActions.clearHotelMainSearchs,
    state => adapter.removeAll(state),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelMainSearchReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
