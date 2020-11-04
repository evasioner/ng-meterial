import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightMainSearch } from './flight-main-search.model';

export const loadFlightMainSearchs = createAction(
  '[FlightMainSearch/API] Load FlightMainSearchs', 
  props<{ flightMainSearchs: FlightMainSearch[] }>()
);

export const addFlightMainSearch = createAction(
  '[FlightMainSearch/API] Add FlightMainSearch',
  props<{ flightMainSearch: FlightMainSearch }>()
);

export const upsertFlightMainSearch = createAction(
  '[FlightMainSearch/API] Upsert FlightMainSearch',
  props<{ flightMainSearch: FlightMainSearch }>()
);

export const addFlightMainSearchs = createAction(
  '[FlightMainSearch/API] Add FlightMainSearchs',
  props<{ flightMainSearchs: FlightMainSearch[] }>()
);

export const upsertFlightMainSearchs = createAction(
  '[FlightMainSearch/API] Upsert FlightMainSearchs',
  props<{ flightMainSearchs: FlightMainSearch[] }>()
);

export const updateFlightMainSearch = createAction(
  '[FlightMainSearch/API] Update FlightMainSearch',
  props<{ flightMainSearch: Update<FlightMainSearch> }>()
);

export const updateFlightMainSearchs = createAction(
  '[FlightMainSearch/API] Update FlightMainSearchs',
  props<{ flightMainSearchs: Update<FlightMainSearch>[] }>()
);

export const deleteFlightMainSearch = createAction(
  '[FlightMainSearch/API] Delete FlightMainSearch',
  props<{ id: string }>()
);

export const deleteFlightMainSearchs = createAction(
  '[FlightMainSearch/API] Delete FlightMainSearchs',
  props<{ ids: string[] }>()
);

export const clearFlightMainSearchs = createAction(
  '[FlightMainSearch/API] Clear FlightMainSearchs'
);
