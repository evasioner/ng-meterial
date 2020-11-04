import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelModalDestination } from './hotel-modal-destination.model';

export const loadHotelModalDestinations = createAction(
  '[HotelModalDestination/API] Load HotelModalDestinations',
  props<{ hotelModalDestinations: HotelModalDestination[] }>(),
);

export const addHotelModalDestination = createAction(
  '[HotelModalDestination/API] Add HotelModalDestination',
  props<{ hotelModalDestination: HotelModalDestination }>(),
);

export const upsertHotelModalDestination = createAction(
  '[HotelModalDestination/API] Upsert HotelModalDestination',
  props<{ hotelModalDestination: HotelModalDestination }>(),
);

export const addHotelModalDestinations = createAction(
  '[HotelModalDestination/API] Add HotelModalDestinations',
  props<{ hotelModalDestinations: HotelModalDestination[] }>(),
);

export const upsertHotelModalDestinations = createAction(
  '[HotelModalDestination/API] Upsert HotelModalDestinations',
  props<{ hotelModalDestinations: HotelModalDestination[] }>(),
);

export const updateHotelModalDestination = createAction(
  '[HotelModalDestination/API] Update HotelModalDestination',
  props<{ hotelModalDestination: Update<HotelModalDestination> }>(),
);

export const updateHotelModalDestinations = createAction(
  '[HotelModalDestination/API] Update HotelModalDestinations',
  props<{ hotelModalDestinations: Update<HotelModalDestination>[] }>(),
);

export const deleteHotelModalDestination = createAction(
  '[HotelModalDestination/API] Delete HotelModalDestination',
  props<{ id: string }>(),
);

export const deleteHotelModalDestinations = createAction(
  '[HotelModalDestination/API] Delete HotelModalDestinations',
  props<{ ids: string[] }>(),
);

export const clearHotelModalDestinations = createAction(
  '[HotelModalDestination/API] Clear HotelModalDestinations',
);
