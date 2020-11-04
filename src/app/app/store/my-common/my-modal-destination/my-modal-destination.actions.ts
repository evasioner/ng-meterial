import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { MyModalDestination } from './my-modal-destination.model';

export const loadMyModalDestinations = createAction(
  '[MyModalDestination/API] Load MyModalDestinations', 
  props<{ myModalDestinations: MyModalDestination[] }>()
);

export const addMyModalDestination = createAction(
  '[MyModalDestination/API] Add MyModalDestination',
  props<{ myModalDestination: MyModalDestination }>()
);

export const upsertMyModalDestination = createAction(
  '[MyModalDestination/API] Upsert MyModalDestination',
  props<{ myModalDestination: MyModalDestination }>()
);

export const addMyModalDestinations = createAction(
  '[MyModalDestination/API] Add MyModalDestinations',
  props<{ myModalDestinations: MyModalDestination[] }>()
);

export const upsertMyModalDestinations = createAction(
  '[MyModalDestination/API] Upsert MyModalDestinations',
  props<{ myModalDestinations: MyModalDestination[] }>()
);

export const updateMyModalDestination = createAction(
  '[MyModalDestination/API] Update MyModalDestination',
  props<{ myModalDestination: Update<MyModalDestination> }>()
);

export const updateMyModalDestinations = createAction(
  '[MyModalDestination/API] Update MyModalDestinations',
  props<{ myModalDestinations: Update<MyModalDestination>[] }>()
);

export const deleteMyModalDestination = createAction(
  '[MyModalDestination/API] Delete MyModalDestination',
  props<{ id: string }>()
);

export const deleteMyModalDestinations = createAction(
  '[MyModalDestination/API] Delete MyModalDestinations',
  props<{ ids: string[] }>()
);

export const clearMyModalDestinations = createAction(
  '[MyModalDestination/API] Clear MyModalDestinations'
);
