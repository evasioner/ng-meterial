import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { MyReservationList } from './my-reservation-list.model';

export const loadMyReservationLists = createAction(
  '[MyReservationList/API] Load MyReservationLists', 
  props<{ myReservationLists: MyReservationList[] }>()
);

export const addMyReservationList = createAction(
  '[MyReservationList/API] Add MyReservationList',
  props<{ myReservationList: MyReservationList }>()
);

export const upsertMyReservationList = createAction(
  '[MyReservationList/API] Upsert MyReservationList',
  props<{ myReservationList: MyReservationList }>()
);

export const addMyReservationLists = createAction(
  '[MyReservationList/API] Add MyReservationLists',
  props<{ myReservationLists: MyReservationList[] }>()
);

export const upsertMyReservationLists = createAction(
  '[MyReservationList/API] Upsert MyReservationLists',
  props<{ myReservationLists: MyReservationList[] }>()
);

export const updateMyReservationList = createAction(
  '[MyReservationList/API] Update MyReservationList',
  props<{ myReservationList: Update<MyReservationList> }>()
);

export const updateMyReservationLists = createAction(
  '[MyReservationList/API] Update MyReservationLists',
  props<{ myReservationLists: Update<MyReservationList>[] }>()
);

export const deleteMyReservationList = createAction(
  '[MyReservationList/API] Delete MyReservationList',
  props<{ id: string }>()
);

export const deleteMyReservationLists = createAction(
  '[MyReservationList/API] Delete MyReservationLists',
  props<{ ids: string[] }>()
);

export const clearMyReservationLists = createAction(
  '[MyReservationList/API] Clear MyReservationLists'
);
