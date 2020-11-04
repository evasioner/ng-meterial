import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelSearchResult } from './hotel-search-result.model';

export const loadHotelSearchResults = createAction(
  '[HotelSearchResult/API] Load HotelSearchResults',
  props<{ hotelSearchResults: HotelSearchResult[] }>(),
);

export const addHotelSearchResult = createAction(
  '[HotelSearchResult/API] Add HotelSearchResult',
  props<{ hotelSearchResult: HotelSearchResult }>(),
);

export const upsertHotelSearchResult = createAction(
  '[HotelSearchResult/API] Upsert HotelSearchResult',
  props<{ hotelSearchResult: HotelSearchResult }>(),
);

export const addHotelSearchResults = createAction(
  '[HotelSearchResult/API] Add HotelSearchResults',
  props<{ hotelSearchResults: HotelSearchResult[] }>(),
);

export const upsertHotelSearchResults = createAction(
  '[HotelSearchResult/API] Upsert HotelSearchResults',
  props<{ hotelSearchResults: HotelSearchResult[] }>(),
);

export const updateHotelSearchResult = createAction(
  '[HotelSearchResult/API] Update HotelSearchResult',
  props<{ hotelSearchResult: Update<HotelSearchResult> }>(),
);

export const updateHotelSearchResults = createAction(
  '[HotelSearchResult/API] Update HotelSearchResults',
  props<{ hotelSearchResults: Update<HotelSearchResult>[] }>(),
);

export const deleteHotelSearchResult = createAction(
  '[HotelSearchResult/API] Delete HotelSearchResult',
  props<{ id: string }>(),
);

export const deleteHotelSearchResults = createAction(
  '[HotelSearchResult/API] Delete HotelSearchResults',
  props<{ ids: string[] }>(),
);

export const clearHotelSearchResults = createAction(
  '[HotelSearchResult/API] Clear HotelSearchResults',
);
