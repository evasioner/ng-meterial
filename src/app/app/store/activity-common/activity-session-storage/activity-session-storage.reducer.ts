import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivitySessionStorage } from './activity-session-storage.model';
import * as ActivitySessionStorageActions from './activity-session-storage.actions';

export const activitySessionStoragesFeatureKey = 'activitySessionStorages';

export interface State extends EntityState<ActivitySessionStorage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivitySessionStorage> = createEntityAdapter<ActivitySessionStorage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activitySessionStorageReducer = createReducer(
  initialState,
  on(ActivitySessionStorageActions.addActivitySessionStorage,
    (state, action) => adapter.addOne(action.activitySessionStorage, state)
  ),
  on(ActivitySessionStorageActions.upsertActivitySessionStorage,
    (state, action) => adapter.upsertOne(action.activitySessionStorage, state)
  ),
  on(ActivitySessionStorageActions.addActivitySessionStorages,
    (state, action) => adapter.addMany(action.activitySessionStorages, state)
  ),
  on(ActivitySessionStorageActions.upsertActivitySessionStorages,
    (state, action) => adapter.upsertMany(action.activitySessionStorages, state)
  ),
  on(ActivitySessionStorageActions.updateActivitySessionStorage,
    (state, action) => adapter.updateOne(action.activitySessionStorage, state)
  ),
  on(ActivitySessionStorageActions.updateActivitySessionStorages,
    (state, action) => adapter.updateMany(action.activitySessionStorages, state)
  ),
  on(ActivitySessionStorageActions.deleteActivitySessionStorage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivitySessionStorageActions.deleteActivitySessionStorages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivitySessionStorageActions.loadActivitySessionStorages,
    (state, action) => adapter.addAll(action.activitySessionStorages, state)
  ),
  on(ActivitySessionStorageActions.clearActivitySessionStorages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return activitySessionStorageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
