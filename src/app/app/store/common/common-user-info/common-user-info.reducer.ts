import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CommonUserInfo } from './common-user-info.model';
import * as CommonUserInfoActions from './common-user-info.actions';

export const commonUserInfoesFeatureKey = 'commonUserInfoes';

export interface State extends EntityState<CommonUserInfo> {
  // additional entities state properties
}

export const adapter: EntityAdapter<CommonUserInfo> = createEntityAdapter<CommonUserInfo>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const commonUserInfoReducer = createReducer(
  initialState,
  on(CommonUserInfoActions.addCommonUserInfo,
    (state, action) => adapter.addOne(action.commonUserInfo, state)
  ),
  on(CommonUserInfoActions.upsertCommonUserInfo,
    (state, action) => adapter.upsertOne(action.commonUserInfo, state)
  ),
  on(CommonUserInfoActions.addCommonUserInfos,
    (state, action) => adapter.addMany(action.commonUserInfos, state)
  ),
  on(CommonUserInfoActions.upsertCommonUserInfos,
    (state, action) => adapter.upsertMany(action.commonUserInfos, state)
  ),
  on(CommonUserInfoActions.updateCommonUserInfo,
    (state, action) => adapter.updateOne(action.commonUserInfo, state)
  ),
  on(CommonUserInfoActions.updateCommonUserInfos,
    (state, action) => adapter.updateMany(action.commonUserInfos, state)
  ),
  on(CommonUserInfoActions.deleteCommonUserInfo,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(CommonUserInfoActions.deleteCommonUserInfos,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(CommonUserInfoActions.loadCommonUserInfos,
    (state, action) => adapter.addAll(action.commonUserInfos, state)
  ),
  on(CommonUserInfoActions.clearCommonUserInfos,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return commonUserInfoReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
