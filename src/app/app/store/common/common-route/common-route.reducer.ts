import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CommonRoute } from './common-route.model';
import * as CommonRouteActions from './common-route.actions';

export const commonRoutesFeatureKey = 'commonRoutes';

export interface State extends EntityState<CommonRoute> {
  // additional entities state properties
}

export const adapter: EntityAdapter<CommonRoute> = createEntityAdapter<CommonRoute>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const commonRouteReducer = createReducer(
  initialState,
  on(CommonRouteActions.addCommonRoute,
    (state, action) => adapter.addOne(action.commonRoute, state)
  ),
  on(CommonRouteActions.upsertCommonRoute,
    (state, action) => adapter.upsertOne(action.commonRoute, state)
  ),
  on(CommonRouteActions.addCommonRoutes,
    (state, action) => adapter.addMany(action.commonRoutes, state)
  ),
  on(CommonRouteActions.upsertCommonRoutes,
    (state, action) => adapter.upsertMany(action.commonRoutes, state)
  ),
  on(CommonRouteActions.updateCommonRoute,
    (state, action) => adapter.updateOne(action.commonRoute, state)
  ),
  on(CommonRouteActions.updateCommonRoutes,
    (state, action) => adapter.updateMany(action.commonRoutes, state)
  ),
  on(CommonRouteActions.deleteCommonRoute,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(CommonRouteActions.deleteCommonRoutes,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(CommonRouteActions.loadCommonRoutes,
    (state, action) => adapter.addAll(action.commonRoutes, state)
  ),
  on(CommonRouteActions.clearCommonRoutes,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return commonRouteReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
