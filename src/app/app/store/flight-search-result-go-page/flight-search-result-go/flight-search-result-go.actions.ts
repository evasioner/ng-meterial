import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightSearchResultGo } from './flight-search-result-go.model';

export const loadFlightSearchResultGos = createAction(
  '[FlightSearchResultGo/API] Load FlightSearchResultGos', 
  props<{ flightSearchResultGos: FlightSearchResultGo[] }>()
);

export const addFlightSearchResultGo = createAction(
  '[FlightSearchResultGo/API] Add FlightSearchResultGo',
  props<{ flightSearchResultGo: FlightSearchResultGo }>()
);

export const upsertFlightSearchResultGo = createAction(
  '[FlightSearchResultGo/API] Upsert FlightSearchResultGo',
  props<{ flightSearchResultGo: FlightSearchResultGo }>()
);

export const addFlightSearchResultGos = createAction(
  '[FlightSearchResultGo/API] Add FlightSearchResultGos',
  props<{ flightSearchResultGos: FlightSearchResultGo[] }>()
);

export const upsertFlightSearchResultGos = createAction(
  '[FlightSearchResultGo/API] Upsert FlightSearchResultGos',
  props<{ flightSearchResultGos: FlightSearchResultGo[] }>()
);

export const updateFlightSearchResultGo = createAction(
  '[FlightSearchResultGo/API] Update FlightSearchResultGo',
  props<{ flightSearchResultGo: Update<FlightSearchResultGo> }>()
);

export const updateFlightSearchResultGos = createAction(
  '[FlightSearchResultGo/API] Update FlightSearchResultGos',
  props<{ flightSearchResultGos: Update<FlightSearchResultGo>[] }>()
);

export const deleteFlightSearchResultGo = createAction(
  '[FlightSearchResultGo/API] Delete FlightSearchResultGo',
  props<{ id: string }>()
);

export const deleteFlightSearchResultGos = createAction(
  '[FlightSearchResultGo/API] Delete FlightSearchResultGos',
  props<{ ids: string[] }>()
);

export const clearFlightSearchResultGos = createAction(
  '[FlightSearchResultGo/API] Clear FlightSearchResultGos'
);
