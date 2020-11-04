import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelModalTravelerOption } from './hotel-modal-traveler-option.model';

export const loadHotelModalTravelerOptions = createAction(
  '[HotelModalTravelerOption/API] Load HotelModalTravelerOptions',
  props<{ hotelModalTravelerOptions: HotelModalTravelerOption[] }>(),
);

export const addHotelModalTravelerOption = createAction(
  '[HotelModalTravelerOption/API] Add HotelModalTravelerOption',
  props<{ hotelModalTravelerOption: HotelModalTravelerOption }>(),
);

export const upsertHotelModalTravelerOption = createAction(
  '[HotelModalTravelerOption/API] Upsert HotelModalTravelerOption',
  props<{ hotelModalTravelerOption: HotelModalTravelerOption }>(),
);

export const addHotelModalTravelerOptions = createAction(
  '[HotelModalTravelerOption/API] Add HotelModalTravelerOptions',
  props<{ hotelModalTravelerOptions: HotelModalTravelerOption[] }>(),
);

export const upsertHotelModalTravelerOptions = createAction(
  '[HotelModalTravelerOption/API] Upsert HotelModalTravelerOptions',
  props<{ hotelModalTravelerOptions: HotelModalTravelerOption[] }>(),
);

export const updateHotelModalTravelerOption = createAction(
  '[HotelModalTravelerOption/API] Update HotelModalTravelerOption',
  props<{ hotelModalTravelerOption: Update<HotelModalTravelerOption> }>(),
);

export const updateHotelModalTravelerOptions = createAction(
  '[HotelModalTravelerOption/API] Update HotelModalTravelerOptions',
  props<{ hotelModalTravelerOptions: Update<HotelModalTravelerOption>[] }>(),
);

export const deleteHotelModalTravelerOption = createAction(
  '[HotelModalTravelerOption/API] Delete HotelModalTravelerOption',
  props<{ id: string }>(),
);

export const deleteHotelModalTravelerOptions = createAction(
  '[HotelModalTravelerOption/API] Delete HotelModalTravelerOptions',
  props<{ ids: string[] }>(),
);

export const clearHotelModalTravelerOptions = createAction(
  '[HotelModalTravelerOption/API] Clear HotelModalTravelerOptions',
);
