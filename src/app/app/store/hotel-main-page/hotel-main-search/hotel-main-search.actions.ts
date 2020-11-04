import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelMainSearch } from './hotel-main-search.model';

export const loadHotelMainSearchs = createAction(
  '[HotelMainSearch/API] Load HotelMainSearchs',
  props<{ hotelMainSearchs: HotelMainSearch[] }>(),
);

export const addHotelMainSearch = createAction(
  '[HotelMainSearch/API] Add HotelMainSearch',
  props<{ hotelMainSearch: HotelMainSearch }>(),
);

export const upsertHotelMainSearch = createAction(
  '[HotelMainSearch/API] Upsert HotelMainSearch',
  props<{ hotelMainSearch: HotelMainSearch }>(),
);

export const addHotelMainSearchs = createAction(
  '[HotelMainSearch/API] Add HotelMainSearchs',
  props<{ hotelMainSearchs: HotelMainSearch[] }>(),
);

export const upsertHotelMainSearchs = createAction(
  '[HotelMainSearch/API] Upsert HotelMainSearchs',
  props<{ hotelMainSearchs: HotelMainSearch[] }>(),
);

export const updateHotelMainSearch = createAction(
  '[HotelMainSearch/API] Update HotelMainSearch',
  props<{ hotelMainSearch: Update<HotelMainSearch> }>(),
);

export const updateHotelMainSearchs = createAction(
  '[HotelMainSearch/API] Update HotelMainSearchs',
  props<{ hotelMainSearchs: Update<HotelMainSearch>[] }>(),
);

export const deleteHotelMainSearch = createAction(
  '[HotelMainSearch/API] Delete HotelMainSearch',
  props<{ id: string }>(),
);

export const deleteHotelMainSearchs = createAction(
  '[HotelMainSearch/API] Delete HotelMainSearchs',
  props<{ ids: string[] }>(),
);

export const clearHotelMainSearchs = createAction(
  '[HotelMainSearch/API] Clear HotelMainSearchs',
);
