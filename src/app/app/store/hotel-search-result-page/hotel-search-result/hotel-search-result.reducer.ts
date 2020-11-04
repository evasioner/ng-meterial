import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelSearchResult } from './hotel-search-result.model';
import * as HotelSearchResultActions from './hotel-search-result.actions';

export const hotelSearchResultsFeatureKey = 'hotelSearchResults';

export interface State extends EntityState<HotelSearchResult> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelSearchResult> = createEntityAdapter<HotelSearchResult>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelSearchResultReducer = createReducer(
  initialState,
  on(HotelSearchResultActions.addHotelSearchResult,
    (state, action) => adapter.addOne(action.hotelSearchResult, state),
  ),
  on(HotelSearchResultActions.upsertHotelSearchResult,
    (state, action) => adapter.upsertOne(action.hotelSearchResult, state),
  ),
  on(HotelSearchResultActions.addHotelSearchResults,
    (state, action) => adapter.addMany(action.hotelSearchResults, state),
  ),
  on(HotelSearchResultActions.upsertHotelSearchResults,
    (state, action) => adapter.upsertMany(action.hotelSearchResults, state),
  ),
  on(HotelSearchResultActions.updateHotelSearchResult,
    (state, action) => adapter.updateOne(action.hotelSearchResult, state),
  ),
  on(HotelSearchResultActions.updateHotelSearchResults,
    (state, action) => adapter.updateMany(action.hotelSearchResults, state),
  ),
  on(HotelSearchResultActions.deleteHotelSearchResult,
    (state, action) => adapter.removeOne(action.id, state),
  ),
  on(HotelSearchResultActions.deleteHotelSearchResults,
    (state, action) => adapter.removeMany(action.ids, state),
  ),
  on(HotelSearchResultActions.loadHotelSearchResults,
    (state, action) => adapter.addAll(action.hotelSearchResults, state),
  ),
  on(HotelSearchResultActions.clearHotelSearchResults,
    state => adapter.removeAll(state),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelSearchResultReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
