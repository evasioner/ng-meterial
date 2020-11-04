import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivityModalDestination } from './activity-modal-destination.model';

export const loadActivityModalDestinations = createAction(
  '[ActivityModalDestination/API] Load ActivityModalDestinations', 
  props<{ activityModalDestinations: ActivityModalDestination[] }>()
);

export const addActivityModalDestination = createAction(
  '[ActivityModalDestination/API] Add ActivityModalDestination',
  props<{ activityModalDestination: ActivityModalDestination }>()
);

export const upsertActivityModalDestination = createAction(
  '[ActivityModalDestination/API] Upsert ActivityModalDestination',
  props<{ activityModalDestination: ActivityModalDestination }>()
);

export const addActivityModalDestinations = createAction(
  '[ActivityModalDestination/API] Add ActivityModalDestinations',
  props<{ activityModalDestinations: ActivityModalDestination[] }>()
);

export const upsertActivityModalDestinations = createAction(
  '[ActivityModalDestination/API] Upsert ActivityModalDestinations',
  props<{ activityModalDestinations: ActivityModalDestination[] }>()
);

export const updateActivityModalDestination = createAction(
  '[ActivityModalDestination/API] Update ActivityModalDestination',
  props<{ activityModalDestination: Update<ActivityModalDestination> }>()
);

export const updateActivityModalDestinations = createAction(
  '[ActivityModalDestination/API] Update ActivityModalDestinations',
  props<{ activityModalDestinations: Update<ActivityModalDestination>[] }>()
);

export const deleteActivityModalDestination = createAction(
  '[ActivityModalDestination/API] Delete ActivityModalDestination',
  props<{ id: string }>()
);

export const deleteActivityModalDestinations = createAction(
  '[ActivityModalDestination/API] Delete ActivityModalDestinations',
  props<{ ids: string[] }>()
);

export const clearActivityModalDestinations = createAction(
  '[ActivityModalDestination/API] Clear ActivityModalDestinations'
);
