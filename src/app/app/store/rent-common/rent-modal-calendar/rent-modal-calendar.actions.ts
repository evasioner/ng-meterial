import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { RentModalCalendar } from './rent-modal-calendar.model';

export const loadRentModalCalendars = createAction(
  '[RentModalCalendar/API] Load RentModalCalendars', 
  props<{ rentModalCalendars: RentModalCalendar[] }>()
);

export const addRentModalCalendar = createAction(
  '[RentModalCalendar/API] Add RentModalCalendar',
  props<{ rentModalCalendar: RentModalCalendar }>()
);

export const upsertRentModalCalendar = createAction(
  '[RentModalCalendar/API] Upsert RentModalCalendar',
  props<{ rentModalCalendar: RentModalCalendar }>()
);

export const addRentModalCalendars = createAction(
  '[RentModalCalendar/API] Add RentModalCalendars',
  props<{ rentModalCalendars: RentModalCalendar[] }>()
);

export const upsertRentModalCalendars = createAction(
  '[RentModalCalendar/API] Upsert RentModalCalendars',
  props<{ rentModalCalendars: RentModalCalendar[] }>()
);

export const updateRentModalCalendar = createAction(
  '[RentModalCalendar/API] Update RentModalCalendar',
  props<{ rentModalCalendar: Update<RentModalCalendar> }>()
);

export const updateRentModalCalendars = createAction(
  '[RentModalCalendar/API] Update RentModalCalendars',
  props<{ rentModalCalendars: Update<RentModalCalendar>[] }>()
);

export const deleteRentModalCalendar = createAction(
  '[RentModalCalendar/API] Delete RentModalCalendar',
  props<{ id: string }>()
);

export const deleteRentModalCalendars = createAction(
  '[RentModalCalendar/API] Delete RentModalCalendars',
  props<{ ids: string[] }>()
);

export const clearRentModalCalendars = createAction(
  '[RentModalCalendar/API] Clear RentModalCalendars'
);
