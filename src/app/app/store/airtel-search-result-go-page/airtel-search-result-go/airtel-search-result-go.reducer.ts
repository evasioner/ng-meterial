import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AirtelSearchResultGo } from './airtel-search-result-go.model';
import { AirtelSearchResultGoActions, AirtelSearchResultGoActionTypes } from './airtel-search-result-go.actions';

export const airtelSearchResultGoesFeatureKey = 'airtelSearchResultGoes';

export interface State extends EntityState<AirtelSearchResultGo> {
  // additional entities state properties
}

export const adapter: EntityAdapter<AirtelSearchResultGo> = createEntityAdapter<AirtelSearchResultGo>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: AirtelSearchResultGoActions
): State {
  switch (action.type) {
    case AirtelSearchResultGoActionTypes.AddAirtelSearchResultGo: {
      return adapter.addOne(action.payload.airtelSearchResultGo, state);
    }

    case AirtelSearchResultGoActionTypes.UpsertAirtelSearchResultGo: {
      return adapter.upsertOne(action.payload.airtelSearchResultGo, state);
    }

    case AirtelSearchResultGoActionTypes.AddAirtelSearchResultGos: {
      return adapter.addMany(action.payload.airtelSearchResultGos, state);
    }

    case AirtelSearchResultGoActionTypes.UpsertAirtelSearchResultGos: {
      return adapter.upsertMany(action.payload.airtelSearchResultGos, state);
    }

    case AirtelSearchResultGoActionTypes.UpdateAirtelSearchResultGo: {
      return adapter.updateOne(action.payload.airtelSearchResultGo, state);
    }

    case AirtelSearchResultGoActionTypes.UpdateAirtelSearchResultGos: {
      return adapter.updateMany(action.payload.airtelSearchResultGos, state);
    }

    case AirtelSearchResultGoActionTypes.DeleteAirtelSearchResultGo: {
      return adapter.removeOne(action.payload.id, state);
    }

    case AirtelSearchResultGoActionTypes.DeleteAirtelSearchResultGos: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case AirtelSearchResultGoActionTypes.LoadAirtelSearchResultGos: {
      return adapter.addAll(action.payload.airtelSearchResultGos, state);
    }

    case AirtelSearchResultGoActionTypes.ClearAirtelSearchResultGos: {
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
