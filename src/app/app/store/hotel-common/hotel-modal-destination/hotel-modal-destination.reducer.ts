import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { HotelModalDestination } from './hotel-modal-destination.model';
import * as HotelModalDestinationActions from './hotel-modal-destination.actions';

export const hotelModalDestinationsFeatureKey = 'hotelModalDestinations';

export interface State extends EntityState<HotelModalDestination> {
  // additional entities state properties
}

export const adapter: EntityAdapter<HotelModalDestination> = createEntityAdapter<HotelModalDestination>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const hotelModalDestinationReducer = createReducer(
  initialState,
  on(HotelModalDestinationActions.addHotelModalDestination,
    (state, action) => adapter.addOne(action.hotelModalDestination, state),
  ),
  on(HotelModalDestinationActions.upsertHotelModalDestination,
    (state, action) => adapter.upsertOne(action.hotelModalDestination, state),
  ),
  on(HotelModalDestinationActions.addHotelModalDestinations,
    (state, action) => adapter.addMany(action.hotelModalDestinations, state),
  ),
  on(HotelModalDestinationActions.upsertHotelModalDestinations,
    (state, action) => adapter.upsertMany(action.hotelModalDestinations, state),
  ),
  on(HotelModalDestinationActions.updateHotelModalDestination,
    (state, action) => adapter.updateOne(action.hotelModalDestination, state),
  ),
  on(HotelModalDestinationActions.updateHotelModalDestinations,
    (state, action) => adapter.updateMany(action.hotelModalDestinations, state),
  ),
  on(HotelModalDestinationActions.deleteHotelModalDestination,
    (state, action) => adapter.removeOne(action.id, state),
  ),
  on(HotelModalDestinationActions.deleteHotelModalDestinations,
    (state, action) => adapter.removeMany(action.ids, state),
  ),
  on(HotelModalDestinationActions.loadHotelModalDestinations,
    (state, action) => adapter.addAll(action.hotelModalDestinations, state),
  ),
  on(HotelModalDestinationActions.clearHotelModalDestinations,
    state => adapter.removeAll(state),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return hotelModalDestinationReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
