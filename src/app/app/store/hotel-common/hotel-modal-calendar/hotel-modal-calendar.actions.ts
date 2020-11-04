import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelModalCalendar } from './hotel-modal-calendar.model';

export const loadHotelModalCalendars = createAction(
  '[HotelModalCalendar/API] Load HotelModalCalendars',
  props<{ hotelModalCalendars: HotelModalCalendar[] }>(),
);

export const addHotelModalCalendar = createAction(
  '[HotelModalCalendar/API] Add HotelModalCalendar',
  props<{ hotelModalCalendar: HotelModalCalendar }>(),
);

export const upsertHotelModalCalendar = createAction(
  '[HotelModalCalendar/API] Upsert HotelModalCalendar',
  props<{ hotelModalCalendar: HotelModalCalendar }>(),
);

export const addHotelModalCalendars = createAction(
  '[HotelModalCalendar/API] Add HotelModalCalendars',
  props<{ hotelModalCalendars: HotelModalCalendar[] }>(),
);

export const upsertHotelModalCalendars = createAction(
  '[HotelModalCalendar/API] Upsert HotelModalCalendars',
  props<{ hotelModalCalendars: HotelModalCalendar[] }>(),
);

export const updateHotelModalCalendar = createAction(
  '[HotelModalCalendar/API] Update HotelModalCalendar',
  props<{ hotelModalCalendar: Update<HotelModalCalendar> }>(),
);

export const updateHotelModalCalendars = createAction(
  '[HotelModalCalendar/API] Update HotelModalCalendars',
  props<{ hotelModalCalendars: Update<HotelModalCalendar>[] }>(),
);

export const deleteHotelModalCalendar = createAction(
  '[HotelModalCalendar/API] Delete HotelModalCalendar',
  props<{ id: string }>(),
);

export const deleteHotelModalCalendars = createAction(
  '[HotelModalCalendar/API] Delete HotelModalCalendars',
  props<{ ids: string[] }>(),
);

export const clearHotelModalCalendars = createAction(
  '[HotelModalCalendar/API] Clear HotelModalCalendars',
);
