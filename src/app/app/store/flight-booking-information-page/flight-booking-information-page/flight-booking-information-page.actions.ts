import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightBookingInformationPage } from './flight-booking-information-page.model';

export const loadFlightBookingInformationPages = createAction(
  '[FlightBookingInformationPage/API] Load FlightBookingInformationPages', 
  props<{ flightBookingInformationPages: FlightBookingInformationPage[] }>()
);

export const addFlightBookingInformationPage = createAction(
  '[FlightBookingInformationPage/API] Add FlightBookingInformationPage',
  props<{ flightBookingInformationPage: FlightBookingInformationPage }>()
);

export const upsertFlightBookingInformationPage = createAction(
  '[FlightBookingInformationPage/API] Upsert FlightBookingInformationPage',
  props<{ flightBookingInformationPage: FlightBookingInformationPage }>()
);

export const addFlightBookingInformationPages = createAction(
  '[FlightBookingInformationPage/API] Add FlightBookingInformationPages',
  props<{ flightBookingInformationPages: FlightBookingInformationPage[] }>()
);

export const upsertFlightBookingInformationPages = createAction(
  '[FlightBookingInformationPage/API] Upsert FlightBookingInformationPages',
  props<{ flightBookingInformationPages: FlightBookingInformationPage[] }>()
);

export const updateFlightBookingInformationPage = createAction(
  '[FlightBookingInformationPage/API] Update FlightBookingInformationPage',
  props<{ flightBookingInformationPage: Update<FlightBookingInformationPage> }>()
);

export const updateFlightBookingInformationPages = createAction(
  '[FlightBookingInformationPage/API] Update FlightBookingInformationPages',
  props<{ flightBookingInformationPages: Update<FlightBookingInformationPage>[] }>()
);

export const deleteFlightBookingInformationPage = createAction(
  '[FlightBookingInformationPage/API] Delete FlightBookingInformationPage',
  props<{ id: string }>()
);

export const deleteFlightBookingInformationPages = createAction(
  '[FlightBookingInformationPage/API] Delete FlightBookingInformationPages',
  props<{ ids: string[] }>()
);

export const clearFlightBookingInformationPages = createAction(
  '[FlightBookingInformationPage/API] Clear FlightBookingInformationPages'
);
