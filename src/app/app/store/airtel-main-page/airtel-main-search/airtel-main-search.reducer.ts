import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AirtelMainSearch } from './airtel-main-search.model';
import { AirtelMainSearchActions, AirtelMainSearchActionTypes } from './airtel-main-search.actions';

export const airtelMainSearchesFeatureKey = 'airtelMainSearches';

export interface State extends EntityState<AirtelMainSearch> {
  // additional entities state properties
}

export const adapter: EntityAdapter<AirtelMainSearch> = createEntityAdapter<AirtelMainSearch>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: AirtelMainSearchActions
): State {
  switch (action.type) {
    case AirtelMainSearchActionTypes.AddAirtelMainSearch: {
      return adapter.addOne(action.payload.airtelMainSearch, state);
    }

    case AirtelMainSearchActionTypes.UpsertAirtelMainSearch: {
      return adapter.upsertOne(action.payload.airtelMainSearch, state);
    }

    case AirtelMainSearchActionTypes.AddAirtelMainSearchs: {
      return adapter.addMany(action.payload.airtelMainSearchs, state);
    }

    case AirtelMainSearchActionTypes.UpsertAirtelMainSearchs: {
      return adapter.upsertMany(action.payload.airtelMainSearchs, state);
    }

    case AirtelMainSearchActionTypes.UpdateAirtelMainSearch: {
      return adapter.updateOne(action.payload.airtelMainSearch, state);
    }

    case AirtelMainSearchActionTypes.UpdateAirtelMainSearchs: {
      return adapter.updateMany(action.payload.airtelMainSearchs, state);
    }

    case AirtelMainSearchActionTypes.DeleteAirtelMainSearch: {
      return adapter.removeOne(action.payload.id, state);
    }

    case AirtelMainSearchActionTypes.DeleteAirtelMainSearchs: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case AirtelMainSearchActionTypes.LoadAirtelMainSearchs: {
      return adapter.addAll(action.payload.airtelMainSearchs, state);
    }

    case AirtelMainSearchActionTypes.ClearAirtelMainSearchs: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
