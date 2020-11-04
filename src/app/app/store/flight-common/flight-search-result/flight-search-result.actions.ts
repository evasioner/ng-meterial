import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightSearchResult } from './flight-search-result.model';

export const loadFlightSearchResults = createAction(
    '[FlightSearchResult/API] Load FlightSearchResults',
    props<{ flightSearchResults: FlightSearchResult[] }>()
);

export const addFlightSearchResult = createAction(
    '[FlightSearchResult/API] Add FlightSearchResult',
    props<{ flightSearchResult: FlightSearchResult }>()
);

export const upsertFlightSearchResult = createAction(
    '[FlightSearchResult/API] Upsert FlightSearchResult',
    props<{ flightSearchResult: FlightSearchResult }>()
);

export const addFlightSearchResults = createAction(
    '[FlightSearchResult/API] Add FlightSearchResults',
    props<{ flightSearchResults: FlightSearchResult[] }>()
);

export const upsertFlightSearchResults = createAction(
    '[FlightSearchResult/API] Upsert FlightSearchResults',
    props<{ flightSearchResults: FlightSearchResult[] }>()
);

export const updateFlightSearchResult = createAction(
    '[FlightSearchResult/API] Update FlightSearchResult',
    props<{ flightSearchResult: Update<FlightSearchResult> }>()
);

export const updateFlightSearchResults = createAction(
    '[FlightSearchResult/API] Update FlightSearchResults',
    props<{ flightSearchResults: Update<FlightSearchResult>[] }>()
);

export const deleteFlightSearchResult = createAction(
    '[FlightSearchResult/API] Delete FlightSearchResult',
    props<{ id: string }>()
);

export const deleteFlightSearchResults = createAction(
    '[FlightSearchResult/API] Delete FlightSearchResults',
    props<{ ids: string[] }>()
);

export const clearFlightSearchResults = createAction(
    '[FlightSearchResult/API] Clear FlightSearchResults'
);
