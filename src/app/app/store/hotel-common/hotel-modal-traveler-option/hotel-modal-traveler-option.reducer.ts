import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelModalTravelerOption } from './hotel-modal-traveler-option.model';
import * as HotelModalTravelerOptionActions from './hotel-modal-traveler-option.actions';

export const hotelModalTravelerOptionsFeatureKey = 'hotelModalTravelerOptions';

export interface State extends EntityState<HotelModalTravelerOption> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelModalTravelerOption> = createEntityAdapter<HotelModalTravelerOption>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelModalTravelerOptionReducer = createReducer(
  initialState,
  on(HotelModalTravelerOptionActions.addHotelModalTravelerOption,
    (state, action) => adapter.addOne(action.hotelModalTravelerOption, state),
  ),
  on(HotelModalTravelerOptionActions.upsertHotelModalTravelerOption,
    (state, action) => adapter.upsertOne(action.hotelModalTravelerOption, state),
  ),
  on(HotelModalTravelerOptionActions.addHotelModalTravelerOptions,
    (state, action) => adapter.addMany(action.hotelModalTravelerOptions, state),
  ),
  on(HotelModalTravelerOptionActions.upsertHotelModalTravelerOptions,
    (state, action) => adapter.upsertMany(action.hotelModalTravelerOptions, state),
  ),
  on(HotelModalTravelerOptionActions.updateHotelModalTravelerOption,
    (state, action) => adapter.updateOne(action.hotelModalTravelerOption, state),
  ),
  on(HotelModalTravelerOptionActions.updateHotelModalTravelerOptions,
    (state, action) => adapter.updateMany(action.hotelModalTravelerOptions, state),
  ),
  on(HotelModalTravelerOptionActions.deleteHotelModalTravelerOption,
    (state, action) => adapter.removeOne(action.id, state),
  ),
  on(HotelModalTravelerOptionActions.deleteHotelModalTravelerOptions,
    (state, action) => adapter.removeMany(action.ids, state),
  ),
  on(HotelModalTravelerOptionActions.loadHotelModalTravelerOptions,
    (state, action) => adapter.addAll(action.hotelModalTravelerOptions, state),
  ),
  on(HotelModalTravelerOptionActions.clearHotelModalTravelerOptions,
    state => adapter.removeAll(state),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelModalTravelerOptionReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
