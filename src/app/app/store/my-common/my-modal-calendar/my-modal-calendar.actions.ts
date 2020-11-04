import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { MyModalCalendar } from './my-modal-calendar.model';

export const loadMyModalCalendars = createAction(
  '[MyModalCalendar/API] Load MyModalCalendars', 
  props<{ myModalCalendars: MyModalCalendar[] }>()
);

export const addMyModalCalendar = createAction(
  '[MyModalCalendar/API] Add MyModalCalendar',
  props<{ myModalCalendar: MyModalCalendar }>()
);

export const upsertMyModalCalendar = createAction(
  '[MyModalCalendar/API] Upsert MyModalCalendar',
  props<{ myModalCalendar: MyModalCalendar }>()
);

export const addMyModalCalendars = createAction(
  '[MyModalCalendar/API] Add MyModalCalendars',
  props<{ myModalCalendars: MyModalCalendar[] }>()
);

export const upsertMyModalCalendars = createAction(
  '[MyModalCalendar/API] Upsert MyModalCalendars',
  props<{ myModalCalendars: MyModalCalendar[] }>()
);

export const updateMyModalCalendar = createAction(
  '[MyModalCalendar/API] Update MyModalCalendar',
  props<{ myModalCalendar: Update<MyModalCalendar> }>()
);

export const updateMyModalCalendars = createAction(
  '[MyModalCalendar/API] Update MyModalCalendars',
  props<{ myModalCalendars: Update<MyModalCalendar>[] }>()
);

export const deleteMyModalCalendar = createAction(
  '[MyModalCalendar/API] Delete MyModalCalendar',
  props<{ id: string }>()
);

export const deleteMyModalCalendars = createAction(
  '[MyModalCalendar/API] Delete MyModalCalendars',
  props<{ ids: string[] }>()
);

export const clearMyModalCalendars = createAction(
  '[MyModalCalendar/API] Clear MyModalCalendars'
);
