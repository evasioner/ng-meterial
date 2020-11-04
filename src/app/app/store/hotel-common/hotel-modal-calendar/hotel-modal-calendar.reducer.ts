import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelModalCalendar } from './hotel-modal-calendar.model';
import * as HotelModalCalendarActions from './hotel-modal-calendar.actions';

export const hotelModalCalendarsFeatureKey = 'hotelModalCalendars';

export interface State extends EntityState<HotelModalCalendar> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelModalCalendar> = createEntityAdapter<HotelModalCalendar>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelModalCalendarReducer = createReducer(
  initialState,
  on(HotelModalCalendarActions.addHotelModalCalendar,
    (state, action) => adapter.addOne(action.hotelModalCalendar, state),
  ),
  on(HotelModalCalendarActions.upsertHotelModalCalendar,
    (state, action) => adapter.upsertOne(action.hotelModalCalendar, state),
  ),
  on(HotelModalCalendarActions.addHotelModalCalendars,
    (state, action) => adapter.addMany(action.hotelModalCalendars, state),
  ),
  on(HotelModalCalendarActions.upsertHotelModalCalendars,
    (state, action) => adapter.upsertMany(action.hotelModalCalendars, state),
  ),
  on(HotelModalCalendarActions.updateHotelModalCalendar,
    (state, action) => adapter.updateOne(action.hotelModalCalendar, state),
  ),
  on(HotelModalCalendarActions.updateHotelModalCalendars,
    (state, action) => adapter.updateMany(action.hotelModalCalendars, state),
  ),
  on(HotelModalCalendarActions.deleteHotelModalCalendar,
    (state, action) => adapter.removeOne(action.id, state),
  ),
  on(HotelModalCalendarActions.deleteHotelModalCalendars,
    (state, action) => adapter.removeMany(action.ids, state),
  ),
  on(HotelModalCalendarActions.loadHotelModalCalendars,
    (state, action) => adapter.addAll(action.hotelModalCalendars, state),
  ),
  on(HotelModalCalendarActions.clearHotelModalCalendars,
    state => adapter.removeAll(state),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelModalCalendarReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
