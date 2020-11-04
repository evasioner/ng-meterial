import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { MyReservationDetail } from './my-reservation-detail.model';

export const loadMyReservationDetails = createAction(
  '[MyReservationDetail/API] Load MyReservationDetails', 
  props<{ myReservationDetails: MyReservationDetail[] }>()
);

export const addMyReservationDetail = createAction(
  '[MyReservationDetail/API] Add MyReservationDetail',
  props<{ myReservationDetail: MyReservationDetail }>()
);

export const upsertMyReservationDetail = createAction(
  '[MyReservationDetail/API] Upsert MyReservationDetail',
  props<{ myReservationDetail: MyReservationDetail }>()
);

export const addMyReservationDetails = createAction(
  '[MyReservationDetail/API] Add MyReservationDetails',
  props<{ myReservationDetails: MyReservationDetail[] }>()
);

export const upsertMyReservationDetails = createAction(
  '[MyReservationDetail/API] Upsert MyReservationDetails',
  props<{ myReservationDetails: MyReservationDetail[] }>()
);

export const updateMyReservationDetail = createAction(
  '[MyReservationDetail/API] Update MyReservationDetail',
  props<{ myReservationDetail: Update<MyReservationDetail> }>()
);

export const updateMyReservationDetails = createAction(
  '[MyReservationDetail/API] Update MyReservationDetails',
  props<{ myReservationDetails: Update<MyReservationDetail>[] }>()
);

export const deleteMyReservationDetail = createAction(
  '[MyReservationDetail/API] Delete MyReservationDetail',
  props<{ id: string }>()
);

export const deleteMyReservationDetails = createAction(
  '[MyReservationDetail/API] Delete MyReservationDetails',
  props<{ ids: string[] }>()
);

export const clearMyReservationDetails = createAction(
  '[MyReservationDetail/API] Clear MyReservationDetails'
);
