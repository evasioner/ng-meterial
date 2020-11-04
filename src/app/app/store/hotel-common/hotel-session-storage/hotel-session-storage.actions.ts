import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelSessionStorage } from './hotel-session-storage.model';

export const loadHotelSessionStorages = createAction(
  '[HotelSessionStorage/API] Load HotelSessionStorages', 
  props<{ hotelSessionStorages: HotelSessionStorage[] }>()
);

export const addHotelSessionStorage = createAction(
  '[HotelSessionStorage/API] Add HotelSessionStorage',
  props<{ hotelSessionStorage: HotelSessionStorage }>()
);

export const upsertHotelSessionStorage = createAction(
  '[HotelSessionStorage/API] Upsert HotelSessionStorage',
  props<{ hotelSessionStorage: HotelSessionStorage }>()
);

export const addHotelSessionStorages = createAction(
  '[HotelSessionStorage/API] Add HotelSessionStorages',
  props<{ hotelSessionStorages: HotelSessionStorage[] }>()
);

export const upsertHotelSessionStorages = createAction(
  '[HotelSessionStorage/API] Upsert HotelSessionStorages',
  props<{ hotelSessionStorages: HotelSessionStorage[] }>()
);

export const updateHotelSessionStorage = createAction(
  '[HotelSessionStorage/API] Update HotelSessionStorage',
  props<{ hotelSessionStorage: Update<HotelSessionStorage> }>()
);

export const updateHotelSessionStorages = createAction(
  '[HotelSessionStorage/API] Update HotelSessionStorages',
  props<{ hotelSessionStorages: Update<HotelSessionStorage>[] }>()
);

export const deleteHotelSessionStorage = createAction(
  '[HotelSessionStorage/API] Delete HotelSessionStorage',
  props<{ id: string }>()
);

export const deleteHotelSessionStorages = createAction(
  '[HotelSessionStorage/API] Delete HotelSessionStorages',
  props<{ ids: string[] }>()
);

export const clearHotelSessionStorages = createAction(
  '[HotelSessionStorage/API] Clear HotelSessionStorages'
);
