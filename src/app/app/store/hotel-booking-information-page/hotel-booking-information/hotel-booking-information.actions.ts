import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelBookingInformation } from './hotel-booking-information.model';

export const loadHotelBookingInformations = createAction(
  '[HotelBookingInformation/API] Load HotelBookingInformations', 
  props<{ hotelBookingInformations: HotelBookingInformation[] }>()
);

export const addHotelBookingInformation = createAction(
  '[HotelBookingInformation/API] Add HotelBookingInformation',
  props<{ hotelBookingInformation: HotelBookingInformation }>()
);

export const upsertHotelBookingInformation = createAction(
  '[HotelBookingInformation/API] Upsert HotelBookingInformation',
  props<{ hotelBookingInformation: HotelBookingInformation }>()
);

export const addHotelBookingInformations = createAction(
  '[HotelBookingInformation/API] Add HotelBookingInformations',
  props<{ hotelBookingInformations: HotelBookingInformation[] }>()
);

export const upsertHotelBookingInformations = createAction(
  '[HotelBookingInformation/API] Upsert HotelBookingInformations',
  props<{ hotelBookingInformations: HotelBookingInformation[] }>()
);

export const updateHotelBookingInformation = createAction(
  '[HotelBookingInformation/API] Update HotelBookingInformation',
  props<{ hotelBookingInformation: Update<HotelBookingInformation> }>()
);

export const updateHotelBookingInformations = createAction(
  '[HotelBookingInformation/API] Update HotelBookingInformations',
  props<{ hotelBookingInformations: Update<HotelBookingInformation>[] }>()
);

export const deleteHotelBookingInformation = createAction(
  '[HotelBookingInformation/API] Delete HotelBookingInformation',
  props<{ id: string }>()
);

export const deleteHotelBookingInformations = createAction(
  '[HotelBookingInformation/API] Delete HotelBookingInformations',
  props<{ ids: string[] }>()
);

export const clearHotelBookingInformations = createAction(
  '[HotelBookingInformation/API] Clear HotelBookingInformations'
);
