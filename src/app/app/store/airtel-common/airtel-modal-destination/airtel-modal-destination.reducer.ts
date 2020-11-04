import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AirtelModalDestination } from './airtel-modal-destination.model';
import * as AirtelModalDestinationActions from './airtel-modal-destination.actions';

export const airtelModalDestinationsFeatureKey = 'airtelModalDestinations';

export interface State extends EntityState<AirtelModalDestination> {
    // additional entities state properties
}

export const adapter: EntityAdapter<AirtelModalDestination> = createEntityAdapter<AirtelModalDestination>();

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
});

const airtelModalDestinationReducer = createReducer(
    initialState,
    on(AirtelModalDestinationActions.addAirtelModalDestination,
        (state, action) => adapter.addOne(action.airtelModalDestination, state)
    ),
    on(AirtelModalDestinationActions.upsertAirtelModalDestination,
        (state, action) => adapter.upsertOne(action.airtelModalDestination, state)
    ),
    on(AirtelModalDestinationActions.addAirtelModalDestinations,
        (state, action) => adapter.addMany(action.airtelModalDestinations, state)
    ),
    on(AirtelModalDestinationActions.upsertAirtelModalDestinations,
        (state, action) => adapter.upsertMany(action.airtelModalDestinations, state)
    ),
    on(AirtelModalDestinationActions.updateAirtelModalDestination,
        (state, action) => adapter.updateOne(action.airtelModalDestination, state)
    ),
    on(AirtelModalDestinationActions.updateAirtelModalDestinations,
        (state, action) => adapter.updateMany(action.airtelModalDestinations, state)
    ),
    on(AirtelModalDestinationActions.deleteAirtelModalDestination,
        (state, action) => adapter.removeOne(action.id, state)
    ),
    on(AirtelModalDestinationActions.deleteAirtelModalDestinations,
        (state, action) => adapter.removeMany(action.ids, state)
    ),
    on(AirtelModalDestinationActions.loadAirtelModalDestinations,
        (state, action) => adapter.addAll(action.airtelModalDestinations, state)
    ),
    on(AirtelModalDestinationActions.clearAirtelModalDestinations,
        state => adapter.removeAll(state)
    ),
);

export function reducer(state: State | undefined, action: Action) {
    return airtelModalDestinationReducer(state, action);
}

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();
