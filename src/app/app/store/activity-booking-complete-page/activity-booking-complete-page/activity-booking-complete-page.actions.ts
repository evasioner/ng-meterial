import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivityBookingCompletePage } from './activity-booking-complete-page.model';

export const loadActivityBookingCompletePages = createAction(
  '[ActivityBookingCompletePage/API] Load ActivityBookingCompletePages', 
  props<{ activityBookingCompletePages: ActivityBookingCompletePage[] }>()
);

export const addActivityBookingCompletePage = createAction(
  '[ActivityBookingCompletePage/API] Add ActivityBookingCompletePage',
  props<{ activityBookingCompletePage: ActivityBookingCompletePage }>()
);

export const upsertActivityBookingCompletePage = createAction(
  '[ActivityBookingCompletePage/API] Upsert ActivityBookingCompletePage',
  props<{ activityBookingCompletePage: ActivityBookingCompletePage }>()
);

export const addActivityBookingCompletePages = createAction(
  '[ActivityBookingCompletePage/API] Add ActivityBookingCompletePages',
  props<{ activityBookingCompletePages: ActivityBookingCompletePage[] }>()
);

export const upsertActivityBookingCompletePages = createAction(
  '[ActivityBookingCompletePage/API] Upsert ActivityBookingCompletePages',
  props<{ activityBookingCompletePages: ActivityBookingCompletePage[] }>()
);

export const updateActivityBookingCompletePage = createAction(
  '[ActivityBookingCompletePage/API] Update ActivityBookingCompletePage',
  props<{ activityBookingCompletePage: Update<ActivityBookingCompletePage> }>()
);

export const updateActivityBookingCompletePages = createAction(
  '[ActivityBookingCompletePage/API] Update ActivityBookingCompletePages',
  props<{ activityBookingCompletePages: Update<ActivityBookingCompletePage>[] }>()
);

export const deleteActivityBookingCompletePage = createAction(
  '[ActivityBookingCompletePage/API] Delete ActivityBookingCompletePage',
  props<{ id: string }>()
);

export const deleteActivityBookingCompletePages = createAction(
  '[ActivityBookingCompletePage/API] Delete ActivityBookingCompletePages',
  props<{ ids: string[] }>()
);

export const clearActivityBookingCompletePages = createAction(
  '[ActivityBookingCompletePage/API] Clear ActivityBookingCompletePages'
);
