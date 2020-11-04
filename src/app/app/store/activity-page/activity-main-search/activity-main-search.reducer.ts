import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivityMainSearch } from './activity-main-search.model';
import * as ActivityMainSearchActions from './activity-main-search.actions';

export const activityMainSearchesFeatureKey = 'activityMainSearches';

export interface State extends EntityState<ActivityMainSearch> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivityMainSearch> = createEntityAdapter<ActivityMainSearch>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activityMainSearchReducer = createReducer(
  initialState,
  on(ActivityMainSearchActions.addActivityMainSearch,
    (state, action) => adapter.addOne(action.activityMainSearch, state)
  ),
  on(ActivityMainSearchActions.upsertActivityMainSearch,
    (state, action) => adapter.upsertOne(action.activityMainSearch, state)
  ),
  on(ActivityMainSearchActions.addActivityMainSearchs,
    (state, action) => adapter.addMany(action.activityMainSearchs, state)
  ),
  on(ActivityMainSearchActions.upsertActivityMainSearchs,
    (state, action) => adapter.upsertMany(action.activityMainSearchs, state)
  ),
  on(ActivityMainSearchActions.updateActivityMainSearch,
    (state, action) => adapter.updateOne(action.activityMainSearch, state)
  ),
  on(ActivityMainSearchActions.updateActivityMainSearchs,
    (state, action) => adapter.updateMany(action.activityMainSearchs, state)
  ),
  on(ActivityMainSearchActions.deleteActivityMainSearch,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivityMainSearchActions.deleteActivityMainSearchs,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivityMainSearchActions.loadActivityMainSearchs,
    (state, action) => adapter.addAll(action.activityMainSearchs, state)
  ),
  on(ActivityMainSearchActions.clearActivityMainSearchs,
    state => adapter.removeAll(state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return activityMainSearchReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
