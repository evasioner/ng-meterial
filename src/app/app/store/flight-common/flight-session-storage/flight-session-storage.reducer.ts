import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FlightSessionStorage } from './flight-session-storage.model';
import * as FlightSessionStorageActions from './flight-session-storage.actions';

export const flightSessionStoragesFeatureKey = 'flightSessionStorages';

export interface State extends EntityState<FlightSessionStorage> {
    // additional entities state properties
}

export const adapter: EntityAdapter<FlightSessionStorage> = createEntityAdapter<FlightSessionStorage>();

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
});

const flightSessionStorageReducer = createReducer(
    initialState,
    on(FlightSessionStorageActions.addFlightSessionStorage,
        (state, action) => adapter.addOne(action.flightSessionStorage, state)
    ),
    on(FlightSessionStorageActions.upsertFlightSessionStorage,
        (state, action) => adapter.upsertOne(action.flightSessionStorage, state)
    ),
    on(FlightSessionStorageActions.addFlightSessionStorages,
        (state, action) => adapter.addMany(action.flightSessionStorages, state)
    ),
    on(FlightSessionStorageActions.upsertFlightSessionStorages,
        (state, action) => adapter.upsertMany(action.flightSessionStorages, state)
    ),
    on(FlightSessionStorageActions.updateFlightSessionStorage,
        (state, action) => adapter.updateOne(action.flightSessionStorage, state)
    ),
    on(FlightSessionStorageActions.updateFlightSessionStorages,
        (state, action) => adapter.updateMany(action.flightSessionStorages, state)
    ),
    on(FlightSessionStorageActions.deleteFlightSessionStorage,
        (state, action) => adapter.removeOne(action.id, state)
    ),
    on(FlightSessionStorageActions.deleteFlightSessionStorages,
        (state, action) => adapter.removeMany(action.ids, state)
    ),
    on(FlightSessionStorageActions.loadFlightSessionStorages,
        (state, action) => adapter.addAll(action.flightSessionStorages, state)
    ),
    on(FlightSessionStorageActions.clearFlightSessionStorages,
        state => adapter.removeAll(state)
    ),
);

export function reducer(state: State | undefined, action: Action) {
    return flightSessionStorageReducer(state, action);
}

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();
