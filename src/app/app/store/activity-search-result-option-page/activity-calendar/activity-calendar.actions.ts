import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivityCalendar } from './activity-calendar.model';

export const loadActivityCalendars = createAction(
  '[ActivityCalendar/API] Load ActivityCalendars', 
  props<{ activityCalendars: ActivityCalendar[] }>()
);

export const addActivityCalendar = createAction(
  '[ActivityCalendar/API] Add ActivityCalendar',
  props<{ activityCalendar: ActivityCalendar }>()
);

export const upsertActivityCalendar = createAction(
  '[ActivityCalendar/API] Upsert ActivityCalendar',
  props<{ activityCalendar: ActivityCalendar }>()
);

export const addActivityCalendars = createAction(
  '[ActivityCalendar/API] Add ActivityCalendars',
  props<{ activityCalendars: ActivityCalendar[] }>()
);

export const upsertActivityCalendars = createAction(
  '[ActivityCalendar/API] Upsert ActivityCalendars',
  props<{ activityCalendars: ActivityCalendar[] }>()
);

export const updateActivityCalendar = createAction(
  '[ActivityCalendar/API] Update ActivityCalendar',
  props<{ activityCalendar: Update<ActivityCalendar> }>()
);

export const updateActivityCalendars = createAction(
  '[ActivityCalendar/API] Update ActivityCalendars',
  props<{ activityCalendars: Update<ActivityCalendar>[] }>()
);

export const deleteActivityCalendar = createAction(
  '[ActivityCalendar/API] Delete ActivityCalendar',
  props<{ id: string }>()
);

export const deleteActivityCalendars = createAction(
  '[ActivityCalendar/API] Delete ActivityCalendars',
  props<{ ids: string[] }>()
);

export const clearActivityCalendars = createAction(
  '[ActivityCalendar/API] Clear ActivityCalendars'
);
