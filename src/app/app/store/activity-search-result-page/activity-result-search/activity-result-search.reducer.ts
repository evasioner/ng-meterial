import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivityResultSearch } from './activity-result-search.model';
import * as ActivityResultSearchActions from './activity-result-search.actions';

export const activityResultSearchesFeatureKey = 'activityResultSearches';

export interface State extends EntityState<ActivityResultSearch> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivityResultSearch> = createEntityAdapter<ActivityResultSearch>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activityResultSearchReducer = createReducer(
  initialState,
  on(ActivityResultSearchActions.addActivityResultSearch,
    (state, action) => adapter.addOne(action.activityResultSearch, state)
  ),
  on(ActivityResultSearchActions.upsertActivityResultSearch,
    (state, action) => adapter.upsertOne(action.activityResultSearch, state)
  ),
  on(ActivityResultSearchActions.addActivityResultSearchs,
    (state, action) => adapter.addMany(action.activityResultSearchs, state)
  ),
  on(ActivityResultSearchActions.upsertActivityResultSearchs,
    (state, action) => adapter.upsertMany(action.activityResultSearchs, state)
  ),
  on(ActivityResultSearchActions.updateActivityResultSearch,
    (state, action) => adapter.updateOne(action.activityResultSearch, state)
  ),
  on(ActivityResultSearchActions.updateActivityResultSearchs,
    (state, action) => adapter.updateMany(action.activityResultSearchs, state)
  ),
  on(ActivityResultSearchActions.deleteActivityResultSearch,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivityResultSearchActions.deleteActivityResultSearchs,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivityResultSearchActions.loadActivityResultSearchs,
    (state, action) => adapter.addAll(action.activityResultSearchs, state)
  ),
  on(ActivityResultSearchActions.clearActivityResultSearchs,
    state => adapter.removeAll(state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return activityResultSearchReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
