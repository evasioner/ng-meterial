import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AirtelSearchRoomtype } from './airtel-search-roomtype.model';
import * as AirtelSearchRoomtypeActions from './airtel-search-roomtype.actions';


export const airtelSearchRoomtypeFeatureKey = 'airtelSearchRoomtype';

export interface State extends EntityState<AirtelSearchRoomtype> {
  // additional entities state properties
}

export const adapter: EntityAdapter<AirtelSearchRoomtype> = createEntityAdapter<AirtelSearchRoomtype>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const airtelSearchRoomtypeReducer = createReducer(
  initialState,
  on(AirtelSearchRoomtypeActions.addAirtelSearchRoomtype,
    (state, action) => adapter.addOne(action.airtelSearchRoomtype, state)
  ),
  on(AirtelSearchRoomtypeActions.upsertAirtelSearchRoomtype,
    (state, action) => adapter.upsertOne(action.airtelSearchRoomtype, state)
  ),
  on(AirtelSearchRoomtypeActions.addAirtelSearchRoomtypes,
    (state, action) => adapter.addMany(action.airtelSearchRoomtypes, state)
  ),
  on(AirtelSearchRoomtypeActions.upsertAirtelSearchRoomtypes,
    (state, action) => adapter.upsertMany(action.airtelSearchRoomtypes, state)
  ),
  on(AirtelSearchRoomtypeActions.updateAirtelSearchRoomtype,
    (state, action) => adapter.updateOne(action.airtelSearchRoomtype, state)
  ),
  on(AirtelSearchRoomtypeActions.updateAirtelSearchRoomtypes,
    (state, action) => adapter.updateMany(action.airtelSearchRoomtypes, state)
  ),
  on(AirtelSearchRoomtypeActions.deleteAirtelSearchRoomtype,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(AirtelSearchRoomtypeActions.deleteAirtelSearchRoomtypes,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(AirtelSearchRoomtypeActions.loadAirtelSearchRoomtypes,
    (state, action) => adapter.addAll(action.airtelSearchRoomtypes, state)
  ),
  on(AirtelSearchRoomtypeActions.clearAirtelSearchRoomtypes,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return airtelSearchRoomtypeReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
