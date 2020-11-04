import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { FlightSessionStorage } from './flight-session-storage.model';

export const loadFlightSessionStorages = createAction(
    '[FlightSessionStorage/API] Load FlightSessionStorages',
    props<{ flightSessionStorages: FlightSessionStorage[] }>()
);

export const addFlightSessionStorage = createAction(
    '[FlightSessionStorage/API] Add FlightSessionStorage',
    props<{ flightSessionStorage: FlightSessionStorage }>()
);

export const upsertFlightSessionStorage = createAction(
    '[FlightSessionStorage/API] Upsert FlightSessionStorage',
    props<{ flightSessionStorage: FlightSessionStorage }>()
);

export const addFlightSessionStorages = createAction(
    '[FlightSessionStorage/API] Add FlightSessionStorages',
    props<{ flightSessionStorages: FlightSessionStorage[] }>()
);

export const upsertFlightSessionStorages = createAction(
    '[FlightSessionStorage/API] Upsert FlightSessionStorages',
    props<{ flightSessionStorages: FlightSessionStorage[] }>()
);

export const updateFlightSessionStorage = createAction(
    '[FlightSessionStorage/API] Update FlightSessionStorage',
    props<{ flightSessionStorage: Update<FlightSessionStorage> }>()
);

export const updateFlightSessionStorages = createAction(
    '[FlightSessionStorage/API] Update FlightSessionStorages',
    props<{ flightSessionStorages: Update<FlightSessionStorage>[] }>()
);

export const deleteFlightSessionStorage = createAction(
    '[FlightSessionStorage/API] Delete FlightSessionStorage',
    props<{ id: string }>()
);

export const deleteFlightSessionStorages = createAction(
    '[FlightSessionStorage/API] Delete FlightSessionStorages',
    props<{ ids: string[] }>()
);

export const clearFlightSessionStorages = createAction(
    '[FlightSessionStorage/API] Clear FlightSessionStorages'
);
