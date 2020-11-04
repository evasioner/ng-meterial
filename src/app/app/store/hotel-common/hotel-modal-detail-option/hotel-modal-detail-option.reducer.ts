import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelModalDetailOption } from './hotel-modal-detail-option.model';
import * as HotelModalDetailOptionActions from './hotel-modal-detail-option.actions';

export const hotelModalDetailOptionsFeatureKey = 'hotelModalDetailOptions';

export interface State extends EntityState<HotelModalDetailOption> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelModalDetailOption> = createEntityAdapter<HotelModalDetailOption>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelModalDetailOptionReducer = createReducer(
  initialState,
  on(HotelModalDetailOptionActions.addHotelModalDetailOption,
    (state, action) => adapter.addOne(action.hotelModalDetailOption, state),
  ),
  on(HotelModalDetailOptionActions.upsertHotelModalDetailOption,
    (state, action) => adapter.upsertOne(action.hotelModalDetailOption, state),
  ),
  on(HotelModalDetailOptionActions.addHotelModalDetailOptions,
    (state, action) => adapter.addMany(action.hotelModalDetailOptions, state),
  ),
  on(HotelModalDetailOptionActions.upsertHotelModalDetailOptions,
    (state, action) => adapter.upsertMany(action.hotelModalDetailOptions, state),
  ),
  on(HotelModalDetailOptionActions.updateHotelModalDetailOption,
    (state, action) => adapter.updateOne(action.hotelModalDetailOption, state),
  ),
  on(HotelModalDetailOptionActions.updateHotelModalDetailOptions,
    (state, action) => adapter.updateMany(action.hotelModalDetailOptions, state),
  ),
  on(HotelModalDetailOptionActions.deleteHotelModalDetailOption,
    (state, action) => adapter.removeOne(action.id, state),
  ),
  on(HotelModalDetailOptionActions.deleteHotelModalDetailOptions,
    (state, action) => adapter.removeMany(action.ids, state),
  ),
  on(HotelModalDetailOptionActions.loadHotelModalDetailOptions,
    (state, action) => adapter.addAll(action.hotelModalDetailOptions, state),
  ),
  on(HotelModalDetailOptionActions.clearHotelModalDetailOptions,
    state => adapter.removeAll(state),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelModalDetailOptionReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
