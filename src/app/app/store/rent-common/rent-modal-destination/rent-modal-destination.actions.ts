import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { RentModalDestination } from './rent-modal-destination.model';

export const loadRentModalDestinations = createAction(
  '[RentModalDestination/API] Load RentModalDestinations', 
  props<{ rentModalDestinations: RentModalDestination[] }>()
);

export const addRentModalDestination = createAction(
  '[RentModalDestination/API] Add RentModalDestination',
  props<{ rentModalDestination: RentModalDestination }>()
);

export const upsertRentModalDestination = createAction(
  '[RentModalDestination/API] Upsert RentModalDestination',
  props<{ rentModalDestination: RentModalDestination }>()
);

export const addRentModalDestinations = createAction(
  '[RentModalDestination/API] Add RentModalDestinations',
  props<{ rentModalDestinations: RentModalDestination[] }>()
);

export const upsertRentModalDestinations = createAction(
  '[RentModalDestination/API] Upsert RentModalDestinations',
  props<{ rentModalDestinations: RentModalDestination[] }>()
);

export const updateRentModalDestination = createAction(
  '[RentModalDestination/API] Update RentModalDestination',
  props<{ rentModalDestination: Update<RentModalDestination> }>()
);

export const updateRentModalDestinations = createAction(
  '[RentModalDestination/API] Update RentModalDestinations',
  props<{ rentModalDestinations: Update<RentModalDestination>[] }>()
);

export const deleteRentModalDestination = createAction(
  '[RentModalDestination/API] Delete RentModalDestination',
  props<{ id: string }>()
);

export const deleteRentModalDestinations = createAction(
  '[RentModalDestination/API] Delete RentModalDestinations',
  props<{ ids: string[] }>()
);

export const clearRentModalDestinations = createAction(
  '[RentModalDestination/API] Clear RentModalDestinations'
);
