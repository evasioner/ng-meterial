import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AirtelModalCalendar } from './airtel-modal-calendar.model';

export const loadAirtelModalCalendars = createAction(
  '[AirtelModalCalendar/API] Load AirtelModalCalendars', 
  props<{ airtelModalCalendars: AirtelModalCalendar[] }>()
);

export const addAirtelModalCalendar = createAction(
  '[AirtelModalCalendar/API] Add AirtelModalCalendar',
  props<{ airtelModalCalendar: AirtelModalCalendar }>()
);

export const upsertAirtelModalCalendar = createAction(
  '[AirtelModalCalendar/API] Upsert AirtelModalCalendar',
  props<{ airtelModalCalendar: AirtelModalCalendar }>()
);

export const addAirtelModalCalendars = createAction(
  '[AirtelModalCalendar/API] Add AirtelModalCalendars',
  props<{ airtelModalCalendars: AirtelModalCalendar[] }>()
);

export const upsertAirtelModalCalendars = createAction(
  '[AirtelModalCalendar/API] Upsert AirtelModalCalendars',
  props<{ airtelModalCalendars: AirtelModalCalendar[] }>()
);

export const updateAirtelModalCalendar = createAction(
  '[AirtelModalCalendar/API] Update AirtelModalCalendar',
  props<{ airtelModalCalendar: Update<AirtelModalCalendar> }>()
);

export const updateAirtelModalCalendars = createAction(
  '[AirtelModalCalendar/API] Update AirtelModalCalendars',
  props<{ airtelModalCalendars: Update<AirtelModalCalendar>[] }>()
);

export const deleteAirtelModalCalendar = createAction(
  '[AirtelModalCalendar/API] Delete AirtelModalCalendar',
  props<{ id: string }>()
);

export const deleteAirtelModalCalendars = createAction(
  '[AirtelModalCalendar/API] Delete AirtelModalCalendars',
  props<{ ids: string[] }>()
);

export const clearAirtelModalCalendars = createAction(
  '[AirtelModalCalendar/API] Clear AirtelModalCalendars'
);
