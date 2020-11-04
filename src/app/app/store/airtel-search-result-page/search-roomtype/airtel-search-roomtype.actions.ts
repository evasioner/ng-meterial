import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AirtelSearchRoomtype } from './airtel-search-roomtype.model';

export const loadAirtelSearchRoomtypes = createAction(
  '[AirtelSearchRoomtype/API] Load AirtelSearchRoomtypes',
  props<{ airtelSearchRoomtypes: AirtelSearchRoomtype[] }>()
);

export const addAirtelSearchRoomtype = createAction(
  '[AirtelSearchRoomtype/API] Add AirtelSearchRoomtype',
  props<{ airtelSearchRoomtype: AirtelSearchRoomtype }>()
);

export const upsertAirtelSearchRoomtype = createAction(
  '[AirtelSearchRoomtype/API] Upsert AirtelSearchRoomtype',
  props<{ airtelSearchRoomtype: AirtelSearchRoomtype }>()
);

export const addAirtelSearchRoomtypes = createAction(
  '[AirtelSearchRoomtype/API] Add AirtelSearchRoomtypes',
  props<{ airtelSearchRoomtypes: AirtelSearchRoomtype[] }>()
);

export const upsertAirtelSearchRoomtypes = createAction(
  '[AirtelSearchRoomtype/API] Upsert AirtelSearchRoomtypes',
  props<{ airtelSearchRoomtypes: AirtelSearchRoomtype[] }>()
);

export const updateAirtelSearchRoomtype = createAction(
  '[AirtelSearchRoomtype/API] Update AirtelSearchRoomtype',
  props<{ airtelSearchRoomtype: Update<AirtelSearchRoomtype> }>()
);

export const updateAirtelSearchRoomtypes = createAction(
  '[AirtelSearchRoomtype/API] Update AirtelSearchRoomtypes',
  props<{ airtelSearchRoomtypes: Update<AirtelSearchRoomtype>[] }>()
);

export const deleteAirtelSearchRoomtype = createAction(
  '[AirtelSearchRoomtype/API] Delete AirtelSearchRoomtype',
  props<{ id: string }>()
);

export const deleteAirtelSearchRoomtypes = createAction(
  '[AirtelSearchRoomtype/API] Delete AirtelSearchRoomtypes',
  props<{ ids: string[] }>()
);

export const clearAirtelSearchRoomtypes = createAction(
  '[AirtelSearchRoomtype/API] Clear AirtelSearchRoomtypes'
);
