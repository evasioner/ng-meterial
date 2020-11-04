import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightModalDestination } from './flight-modal-destination.model';

export const loadFlightModalDestinations = createAction(
  '[FlightModalDestination/API] Load FlightModalDestinations', 
  props<{ flightModalDestinations: FlightModalDestination[] }>()
);

export const addFlightModalDestination = createAction(
  '[FlightModalDestination/API] Add FlightModalDestination',
  props<{ flightModalDestination: FlightModalDestination }>()
);

export const upsertFlightModalDestination = createAction(
  '[FlightModalDestination/API] Upsert FlightModalDestination',
  props<{ flightModalDestination: FlightModalDestination }>()
);

export const addFlightModalDestinations = createAction(
  '[FlightModalDestination/API] Add FlightModalDestinations',
  props<{ flightModalDestinations: FlightModalDestination[] }>()
);

export const upsertFlightModalDestinations = createAction(
  '[FlightModalDestination/API] Upsert FlightModalDestinations',
  props<{ flightModalDestinations: FlightModalDestination[] }>()
);

export const updateFlightModalDestination = createAction(
  '[FlightModalDestination/API] Update FlightModalDestination',
  props<{ flightModalDestination: Update<FlightModalDestination> }>()
);

export const updateFlightModalDestinations = createAction(
  '[FlightModalDestination/API] Update FlightModalDestinations',
  props<{ flightModalDestinations: Update<FlightModalDestination>[] }>()
);

export const deleteFlightModalDestination = createAction(
  '[FlightModalDestination/API] Delete FlightModalDestination',
  props<{ id: string }>()
);

export const deleteFlightModalDestinations = createAction(
  '[FlightModalDestination/API] Delete FlightModalDestinations',
  props<{ ids: string[] }>()
);

export const clearFlightModalDestinations = createAction(
  '[FlightModalDestination/API] Clear FlightModalDestinations'
);
