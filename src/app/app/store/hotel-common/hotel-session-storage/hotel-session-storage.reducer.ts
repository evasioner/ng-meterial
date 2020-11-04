import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelSessionStorage } from './hotel-session-storage.model';
import * as HotelSessionStorageActions from './hotel-session-storage.actions';

export const hotelSessionStoragesFeatureKey = 'hotelSessionStorages';

export interface State extends EntityState<HotelSessionStorage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelSessionStorage> = createEntityAdapter<HotelSessionStorage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelSessionStorageReducer = createReducer(
  initialState,
  on(HotelSessionStorageActions.addHotelSessionStorage,
    (state, action) => adapter.addOne(action.hotelSessionStorage, state)
  ),
  on(HotelSessionStorageActions.upsertHotelSessionStorage,
    (state, action) => adapter.upsertOne(action.hotelSessionStorage, state)
  ),
  on(HotelSessionStorageActions.addHotelSessionStorages,
    (state, action) => adapter.addMany(action.hotelSessionStorages, state)
  ),
  on(HotelSessionStorageActions.upsertHotelSessionStorages,
    (state, action) => adapter.upsertMany(action.hotelSessionStorages, state)
  ),
  on(HotelSessionStorageActions.updateHotelSessionStorage,
    (state, action) => adapter.updateOne(action.hotelSessionStorage, state)
  ),
  on(HotelSessionStorageActions.updateHotelSessionStorages,
    (state, action) => adapter.updateMany(action.hotelSessionStorages, state)
  ),
  on(HotelSessionStorageActions.deleteHotelSessionStorage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(HotelSessionStorageActions.deleteHotelSessionStorages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(HotelSessionStorageActions.loadHotelSessionStorages,
    (state, action) => adapter.addAll(action.hotelSessionStorages, state)
  ),
  on(HotelSessionStorageActions.clearHotelSessionStorages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelSessionStorageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
