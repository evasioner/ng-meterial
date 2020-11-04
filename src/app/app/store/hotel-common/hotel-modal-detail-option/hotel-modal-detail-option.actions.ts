import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelModalDetailOption } from './hotel-modal-detail-option.model';

export const loadHotelModalDetailOptions = createAction(
  '[HotelModalDetailOption/API] Load HotelModalDetailOptions',
  props<{ hotelModalDetailOptions: HotelModalDetailOption[] }>(),
);

export const addHotelModalDetailOption = createAction(
  '[HotelModalDetailOption/API] Add HotelModalDetailOption',
  props<{ hotelModalDetailOption: HotelModalDetailOption }>(),
);

export const upsertHotelModalDetailOption = createAction(
  '[HotelModalDetailOption/API] Upsert HotelModalDetailOption',
  props<{ hotelModalDetailOption: HotelModalDetailOption }>(),
);

export const addHotelModalDetailOptions = createAction(
  '[HotelModalDetailOption/API] Add HotelModalDetailOptions',
  props<{ hotelModalDetailOptions: HotelModalDetailOption[] }>(),
);

export const upsertHotelModalDetailOptions = createAction(
  '[HotelModalDetailOption/API] Upsert HotelModalDetailOptions',
  props<{ hotelModalDetailOptions: HotelModalDetailOption[] }>(),
);

export const updateHotelModalDetailOption = createAction(
  '[HotelModalDetailOption/API] Update HotelModalDetailOption',
  props<{ hotelModalDetailOption: Update<HotelModalDetailOption> }>(),
);

export const updateHotelModalDetailOptions = createAction(
  '[HotelModalDetailOption/API] Update HotelModalDetailOptions',
  props<{ hotelModalDetailOptions: Update<HotelModalDetailOption>[] }>(),
);

export const deleteHotelModalDetailOption = createAction(
  '[HotelModalDetailOption/API] Delete HotelModalDetailOption',
  props<{ id: string }>(),
);

export const deleteHotelModalDetailOptions = createAction(
  '[HotelModalDetailOption/API] Delete HotelModalDetailOptions',
  props<{ ids: string[] }>(),
);

export const clearHotelModalDetailOptions = createAction(
  '[HotelModalDetailOption/API] Clear HotelModalDetailOptions',
);
