import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelSearchRoomtype } from './hotel-search-roomtype.model';
import * as HotelSearchRoomtypeActions from './hotel-search-roomtype.actions';

export const hotelSearchRoomtypesFeatureKey = 'hotelSearchRoomtypes';

export interface State extends EntityState<HotelSearchRoomtype> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelSearchRoomtype> = createEntityAdapter<HotelSearchRoomtype>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelSearchRoomtypeReducer = createReducer(
  initialState,
  on(HotelSearchRoomtypeActions.addHotelSearchRoomtype,
    (state, action) => adapter.addOne(action.hotelSearchRoomtype, state)
  ),
  on(HotelSearchRoomtypeActions.upsertHotelSearchRoomtype,
    (state, action) => adapter.upsertOne(action.hotelSearchRoomtype, state)
  ),
  on(HotelSearchRoomtypeActions.addHotelSearchRoomtypes,
    (state, action) => adapter.addMany(action.hotelSearchRoomtypes, state)
  ),
  on(HotelSearchRoomtypeActions.upsertHotelSearchRoomtypes,
    (state, action) => adapter.upsertMany(action.hotelSearchRoomtypes, state)
  ),
  on(HotelSearchRoomtypeActions.updateHotelSearchRoomtype,
    (state, action) => adapter.updateOne(action.hotelSearchRoomtype, state)
  ),
  on(HotelSearchRoomtypeActions.updateHotelSearchRoomtypes,
    (state, action) => adapter.updateMany(action.hotelSearchRoomtypes, state)
  ),
  on(HotelSearchRoomtypeActions.deleteHotelSearchRoomtype,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(HotelSearchRoomtypeActions.deleteHotelSearchRoomtypes,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(HotelSearchRoomtypeActions.loadHotelSearchRoomtypes,
    (state, action) => adapter.addAll(action.hotelSearchRoomtypes, state)
  ),
  on(HotelSearchRoomtypeActions.clearHotelSearchRoomtypes,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelSearchRoomtypeReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();