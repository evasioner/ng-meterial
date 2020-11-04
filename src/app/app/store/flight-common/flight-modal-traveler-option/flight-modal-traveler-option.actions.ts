import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightModalTravelerOption } from './flight-modal-traveler-option.model';

export const loadFlightModalTravelerOptions = createAction(
  '[FlightModalTravelerOption/API] Load FlightModalTravelerOptions', 
  props<{ flightModalTravelerOptions: FlightModalTravelerOption[] }>()
);

export const addFlightModalTravelerOption = createAction(
  '[FlightModalTravelerOption/API] Add FlightModalTravelerOption',
  props<{ flightModalTravelerOption: FlightModalTravelerOption }>()
);

export const upsertFlightModalTravelerOption = createAction(
  '[FlightModalTravelerOption/API] Upsert FlightModalTravelerOption',
  props<{ flightModalTravelerOption: FlightModalTravelerOption }>()
);

export const addFlightModalTravelerOptions = createAction(
  '[FlightModalTravelerOption/API] Add FlightModalTravelerOptions',
  props<{ flightModalTravelerOptions: FlightModalTravelerOption[] }>()
);

export const upsertFlightModalTravelerOptions = createAction(
  '[FlightModalTravelerOption/API] Upsert FlightModalTravelerOptions',
  props<{ flightModalTravelerOptions: FlightModalTravelerOption[] }>()
);

export const updateFlightModalTravelerOption = createAction(
  '[FlightModalTravelerOption/API] Update FlightModalTravelerOption',
  props<{ flightModalTravelerOption: Update<FlightModalTravelerOption> }>()
);

export const updateFlightModalTravelerOptions = createAction(
  '[FlightModalTravelerOption/API] Update FlightModalTravelerOptions',
  props<{ flightModalTravelerOptions: Update<FlightModalTravelerOption>[] }>()
);

export const deleteFlightModalTravelerOption = createAction(
  '[FlightModalTravelerOption/API] Delete FlightModalTravelerOption',
  props<{ id: string }>()
);

export const deleteFlightModalTravelerOptions = createAction(
  '[FlightModalTravelerOption/API] Delete FlightModalTravelerOptions',
  props<{ ids: string[] }>()
);

export const clearFlightModalTravelerOptions = createAction(
  '[FlightModalTravelerOption/API] Clear FlightModalTravelerOptions'
);
