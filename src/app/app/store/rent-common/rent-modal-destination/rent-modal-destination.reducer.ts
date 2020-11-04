import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { RentModalDestination } from './rent-modal-destination.model';
import * as RentModalDestinationActions from './rent-modal-destination.actions';

export const rentModalDestinationsFeatureKey = 'rentModalDestinations';

export interface State extends EntityState<RentModalDestination> {
  // additional entities state properties
}

export const adapter: EntityAdapter<RentModalDestination> = createEntityAdapter<RentModalDestination>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const rentModalDestinationReducer = createReducer(
  initialState,
  on(RentModalDestinationActions.addRentModalDestination,
    (state, action) => adapter.addOne(action.rentModalDestination, state)
  ),
  on(RentModalDestinationActions.upsertRentModalDestination,
    (state, action) => adapter.upsertOne(action.rentModalDestination, state)
  ),
  on(RentModalDestinationActions.addRentModalDestinations,
    (state, action) => adapter.addMany(action.rentModalDestinations, state)
  ),
  on(RentModalDestinationActions.upsertRentModalDestinations,
    (state, action) => adapter.upsertMany(action.rentModalDestinations, state)
  ),
  on(RentModalDestinationActions.updateRentModalDestination,
    (state, action) => adapter.updateOne(action.rentModalDestination, state)
  ),
  on(RentModalDestinationActions.updateRentModalDestinations,
    (state, action) => adapter.updateMany(action.rentModalDestinations, state)
  ),
  on(RentModalDestinationActions.deleteRentModalDestination,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(RentModalDestinationActions.deleteRentModalDestinations,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(RentModalDestinationActions.loadRentModalDestinations,
    (state, action) => adapter.addAll(action.rentModalDestinations, state)
  ),
  on(RentModalDestinationActions.clearRentModalDestinations,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return rentModalDestinationReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
