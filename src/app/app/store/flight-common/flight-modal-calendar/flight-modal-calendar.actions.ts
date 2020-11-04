import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightModalCalendar } from './flight-modal-calendar.model';

export const loadFlightModalCalendars = createAction(
  '[FlightModalCalendar/API] Load FlightModalCalendars', 
  props<{ flightModalCalendars: FlightModalCalendar[] }>()
);

export const addFlightModalCalendar = createAction(
  '[FlightModalCalendar/API] Add FlightModalCalendar',
  props<{ flightModalCalendar: FlightModalCalendar }>()
);

export const upsertFlightModalCalendar = createAction(
  '[FlightModalCalendar/API] Upsert FlightModalCalendar',
  props<{ flightModalCalendar: FlightModalCalendar }>()
);

export const addFlightModalCalendars = createAction(
  '[FlightModalCalendar/API] Add FlightModalCalendars',
  props<{ flightModalCalendars: FlightModalCalendar[] }>()
);

export const upsertFlightModalCalendars = createAction(
  '[FlightModalCalendar/API] Upsert FlightModalCalendars',
  props<{ flightModalCalendars: FlightModalCalendar[] }>()
);

export const updateFlightModalCalendar = createAction(
  '[FlightModalCalendar/API] Update FlightModalCalendar',
  props<{ flightModalCalendar: Update<FlightModalCalendar> }>()
);

export const updateFlightModalCalendars = createAction(
  '[FlightModalCalendar/API] Update FlightModalCalendars',
  props<{ flightModalCalendars: Update<FlightModalCalendar>[] }>()
);

export const deleteFlightModalCalendar = createAction(
  '[FlightModalCalendar/API] Delete FlightModalCalendar',
  props<{ id: string }>()
);

export const deleteFlightModalCalendars = createAction(
  '[FlightModalCalendar/API] Delete FlightModalCalendars',
  props<{ ids: string[] }>()
);

export const clearFlightModalCalendars = createAction(
  '[FlightModalCalendar/API] Clear FlightModalCalendars'
);
