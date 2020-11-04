import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CommonLayout } from './common-layout.model';
import * as CommonLayoutActions from './common-layout.actions';

export const commonLayoutsFeatureKey = 'commonLayouts';

export interface State extends EntityState<CommonLayout> {
  // additional entities state properties
}

export const adapter: EntityAdapter<CommonLayout> = createEntityAdapter<CommonLayout>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const commonLayoutReducer = createReducer(
  initialState,
  on(CommonLayoutActions.addCommonLayout,
    (state, action) => adapter.addOne(action.commonLayout, state)
  ),
  on(CommonLayoutActions.upsertCommonLayout,
    (state, action) => adapter.upsertOne(action.commonLayout, state)
  ),
  on(CommonLayoutActions.addCommonLayouts,
    (state, action) => adapter.addMany(action.commonLayouts, state)
  ),
  on(CommonLayoutActions.upsertCommonLayouts,
    (state, action) => adapter.upsertMany(action.commonLayouts, state)
  ),
  on(CommonLayoutActions.updateCommonLayout,
    (state, action) => adapter.updateOne(action.commonLayout, state)
  ),
  on(CommonLayoutActions.updateCommonLayouts,
    (state, action) => adapter.updateMany(action.commonLayouts, state)
  ),
  on(CommonLayoutActions.deleteCommonLayout,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(CommonLayoutActions.deleteCommonLayouts,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(CommonLayoutActions.loadCommonLayouts,
    (state, action) => adapter.addAll(action.commonLayouts, state)
  ),
  on(CommonLayoutActions.clearCommonLayouts,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return commonLayoutReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
