import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivityModalDestination } from './activity-modal-destination.model';
import * as ActivityModalDestinationActions from './activity-modal-destination.actions';

export const activityModalDestinationsFeatureKey = 'activityModalDestinations';

export interface State extends EntityState<ActivityModalDestination> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivityModalDestination> = createEntityAdapter<ActivityModalDestination>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activityModalDestinationReducer = createReducer(
  initialState,
  on(ActivityModalDestinationActions.addActivityModalDestination,
    (state, action) => adapter.addOne(action.activityModalDestination, state)
  ),
  on(ActivityModalDestinationActions.upsertActivityModalDestination,
    (state, action) => adapter.upsertOne(action.activityModalDestination, state)
  ),
  on(ActivityModalDestinationActions.addActivityModalDestinations,
    (state, action) => adapter.addMany(action.activityModalDestinations, state)
  ),
  on(ActivityModalDestinationActions.upsertActivityModalDestinations,
    (state, action) => adapter.upsertMany(action.activityModalDestinations, state)
  ),
  on(ActivityModalDestinationActions.updateActivityModalDestination,
    (state, action) => adapter.updateOne(action.activityModalDestination, state)
  ),
  on(ActivityModalDestinationActions.updateActivityModalDestinations,
    (state, action) => adapter.updateMany(action.activityModalDestinations, state)
  ),
  on(ActivityModalDestinationActions.deleteActivityModalDestination,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivityModalDestinationActions.deleteActivityModalDestinations,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivityModalDestinationActions.loadActivityModalDestinations,
    (state, action) => adapter.addAll(action.activityModalDestinations, state)
  ),
  on(ActivityModalDestinationActions.clearActivityModalDestinations,
    state => adapter.removeAll(state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return activityModalDestinationReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
