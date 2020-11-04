import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelBookingInformation } from './hotel-booking-information.model';
import * as HotelBookingInformationActions from './hotel-booking-information.actions';

export const hotelBookingInformationsFeatureKey = 'hotelBookingInformations';

export interface State extends EntityState<HotelBookingInformation> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelBookingInformation> = createEntityAdapter<HotelBookingInformation>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelBookingInformationReducer = createReducer(
  initialState,
  on(HotelBookingInformationActions.addHotelBookingInformation,
    (state, action) => adapter.addOne(action.hotelBookingInformation, state)
  ),
  on(HotelBookingInformationActions.upsertHotelBookingInformation,
    (state, action) => adapter.upsertOne(action.hotelBookingInformation, state)
  ),
  on(HotelBookingInformationActions.addHotelBookingInformations,
    (state, action) => adapter.addMany(action.hotelBookingInformations, state)
  ),
  on(HotelBookingInformationActions.upsertHotelBookingInformations,
    (state, action) => adapter.upsertMany(action.hotelBookingInformations, state)
  ),
  on(HotelBookingInformationActions.updateHotelBookingInformation,
    (state, action) => adapter.updateOne(action.hotelBookingInformation, state)
  ),
  on(HotelBookingInformationActions.updateHotelBookingInformations,
    (state, action) => adapter.updateMany(action.hotelBookingInformations, state)
  ),
  on(HotelBookingInformationActions.deleteHotelBookingInformation,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(HotelBookingInformationActions.deleteHotelBookingInformations,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(HotelBookingInformationActions.loadHotelBookingInformations,
    (state, action) => adapter.addAll(action.hotelBookingInformations, state)
  ),
  on(HotelBookingInformationActions.clearHotelBookingInformations,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelBookingInformationReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
