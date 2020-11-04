import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { HotelSearchRoomtype } from './hotel-search-roomtype.model';

export const loadHotelSearchRoomtypes = createAction(
  '[HotelSearchRoomtype/API] Load HotelSearchRoomtypes', 
  props<{ hotelSearchRoomtypes: HotelSearchRoomtype[] }>()
);

export const addHotelSearchRoomtype = createAction(
  '[HotelSearchRoomtype/API] Add HotelSearchRoomtype',
  props<{ hotelSearchRoomtype: HotelSearchRoomtype }>()
);

export const upsertHotelSearchRoomtype = createAction(
  '[HotelSearchRoomtype/API] Upsert HotelSearchRoomtype',
  props<{ hotelSearchRoomtype: HotelSearchRoomtype }>()
);

export const addHotelSearchRoomtypes = createAction(
  '[HotelSearchRoomtype/API] Add HotelSearchRoomtypes',
  props<{ hotelSearchRoomtypes: HotelSearchRoomtype[] }>()
);

export const upsertHotelSearchRoomtypes = createAction(
  '[HotelSearchRoomtype/API] Upsert HotelSearchRoomtypes',
  props<{ hotelSearchRoomtypes: HotelSearchRoomtype[] }>()
);

export const updateHotelSearchRoomtype = createAction(
  '[HotelSearchRoomtype/API] Update HotelSearchRoomtype',
  props<{ hotelSearchRoomtype: Update<HotelSearchRoomtype> }>()
);

export const updateHotelSearchRoomtypes = createAction(
  '[HotelSearchRoomtype/API] Update HotelSearchRoomtypes',
  props<{ hotelSearchRoomtypes: Update<HotelSearchRoomtype>[] }>()
);

export const deleteHotelSearchRoomtype = createAction(
  '[HotelSearchRoomtype/API] Delete HotelSearchRoomtype',
  props<{ id: string }>()
);

export const deleteHotelSearchRoomtypes = createAction(
  '[HotelSearchRoomtype/API] Delete HotelSearchRoomtypes',
  props<{ ids: string[] }>()
);

export const clearHotelSearchRoomtypes = createAction(
  '[HotelSearchRoomtype/API] Clear HotelSearchRoomtypes'
);
