import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { MyMileage } from './my-mileage.model';

export const loadMyMileages = createAction(
  '[MyMileage/API] Load MyMileages', 
  props<{ myMileages: MyMileage[] }>()
);

export const addMyMileage = createAction(
  '[MyMileage/API] Add MyMileage',
  props<{ myMileage: MyMileage }>()
);

export const upsertMyMileage = createAction(
  '[MyMileage/API] Upsert MyMileage',
  props<{ myMileage: MyMileage }>()
);

export const addMyMileages = createAction(
  '[MyMileage/API] Add MyMileages',
  props<{ myMileages: MyMileage[] }>()
);

export const upsertMyMileages = createAction(
  '[MyMileage/API] Upsert MyMileages',
  props<{ myMileages: MyMileage[] }>()
);

export const updateMyMileage = createAction(
  '[MyMileage/API] Update MyMileage',
  props<{ myMileage: Update<MyMileage> }>()
);

export const updateMyMileages = createAction(
  '[MyMileage/API] Update MyMileages',
  props<{ myMileages: Update<MyMileage>[] }>()
);

export const deleteMyMileage = createAction(
  '[MyMileage/API] Delete MyMileage',
  props<{ id: string }>()
);

export const deleteMyMileages = createAction(
  '[MyMileage/API] Delete MyMileages',
  props<{ ids: string[] }>()
);

export const clearMyMileages = createAction(
  '[MyMileage/API] Clear MyMileages'
);
