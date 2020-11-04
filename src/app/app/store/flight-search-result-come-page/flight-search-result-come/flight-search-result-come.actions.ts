import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightSearchResultCome } from './flight-search-result-come.model';

export const loadFlightSearchResultComes = createAction(
  '[FlightSearchResultCome/API] Load FlightSearchResultComes', 
  props<{ flightSearchResultComes: FlightSearchResultCome[] }>()
);

export const addFlightSearchResultCome = createAction(
  '[FlightSearchResultCome/API] Add FlightSearchResultCome',
  props<{ flightSearchResultCome: FlightSearchResultCome }>()
);

export const upsertFlightSearchResultCome = createAction(
  '[FlightSearchResultCome/API] Upsert FlightSearchResultCome',
  props<{ flightSearchResultCome: FlightSearchResultCome }>()
);

export const addFlightSearchResultComes = createAction(
  '[FlightSearchResultCome/API] Add FlightSearchResultComes',
  props<{ flightSearchResultComes: FlightSearchResultCome[] }>()
);

export const upsertFlightSearchResultComes = createAction(
  '[FlightSearchResultCome/API] Upsert FlightSearchResultComes',
  props<{ flightSearchResultComes: FlightSearchResultCome[] }>()
);

export const updateFlightSearchResultCome = createAction(
  '[FlightSearchResultCome/API] Update FlightSearchResultCome',
  props<{ flightSearchResultCome: Update<FlightSearchResultCome> }>()
);

export const updateFlightSearchResultComes = createAction(
  '[FlightSearchResultCome/API] Update FlightSearchResultComes',
  props<{ flightSearchResultComes: Update<FlightSearchResultCome>[] }>()
);

export const deleteFlightSearchResultCome = createAction(
  '[FlightSearchResultCome/API] Delete FlightSearchResultCome',
  props<{ id: string }>()
);

export const deleteFlightSearchResultComes = createAction(
  '[FlightSearchResultCome/API] Delete FlightSearchResultComes',
  props<{ ids: string[] }>()
);

export const clearFlightSearchResultComes = createAction(
  '[FlightSearchResultCome/API] Clear FlightSearchResultComes'
);
