import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivityModalCalendar } from './activity-modal-calendar.model';

export const loadActivityModalCalendars = createAction(
  '[ActivityModalCalendar/API] Load ActivityModalCalendars', 
  props<{ activityModalCalendars: ActivityModalCalendar[] }>()
);

export const addActivityModalCalendar = createAction(
  '[ActivityModalCalendar/API] Add ActivityModalCalendar',
  props<{ activityModalCalendar: ActivityModalCalendar }>()
);

export const upsertActivityModalCalendar = createAction(
  '[ActivityModalCalendar/API] Upsert ActivityModalCalendar',
  props<{ activityModalCalendar: ActivityModalCalendar }>()
);

export const addActivityModalCalendars = createAction(
  '[ActivityModalCalendar/API] Add ActivityModalCalendars',
  props<{ activityModalCalendars: ActivityModalCalendar[] }>()
);

export const upsertActivityModalCalendars = createAction(
  '[ActivityModalCalendar/API] Upsert ActivityModalCalendars',
  props<{ activityModalCalendars: ActivityModalCalendar[] }>()
);

export const updateActivityModalCalendar = createAction(
  '[ActivityModalCalendar/API] Update ActivityModalCalendar',
  props<{ activityModalCalendar: Update<ActivityModalCalendar> }>()
);

export const updateActivityModalCalendars = createAction(
  '[ActivityModalCalendar/API] Update ActivityModalCalendars',
  props<{ activityModalCalendars: Update<ActivityModalCalendar>[] }>()
);

export const deleteActivityModalCalendar = createAction(
  '[ActivityModalCalendar/API] Delete ActivityModalCalendar',
  props<{ id: string }>()
);

export const deleteActivityModalCalendars = createAction(
  '[ActivityModalCalendar/API] Delete ActivityModalCalendars',
  props<{ ids: string[] }>()
);

export const clearActivityModalCalendars = createAction(
  '[ActivityModalCalendar/API] Clear ActivityModalCalendars'
);
