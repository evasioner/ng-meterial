import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivitySearchResultDetailPage } from './activity-search-result-detail-page.model';
import * as ActivitySearchResultDetailPageActions from './activity-search-result-detail-page.actions';

export const activitySearchResultDetailPagesFeatureKey = 'activitySearchResultDetailPages';

export interface State extends EntityState<ActivitySearchResultDetailPage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivitySearchResultDetailPage> = createEntityAdapter<ActivitySearchResultDetailPage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activitySearchResultDetailPageReducer = createReducer(
  initialState,
  on(ActivitySearchResultDetailPageActions.addActivitySearchResultDetailPage,
    (state, action) => adapter.addOne(action.activitySearchResultDetailPage, state)
  ),
  on(ActivitySearchResultDetailPageActions.upsertActivitySearchResultDetailPage,
    (state, action) => adapter.upsertOne(action.activitySearchResultDetailPage, state)
  ),
  on(ActivitySearchResultDetailPageActions.addActivitySearchResultDetailPages,
    (state, action) => adapter.addMany(action.activitySearchResultDetailPages, state)
  ),
  on(ActivitySearchResultDetailPageActions.upsertActivitySearchResultDetailPages,
    (state, action) => adapter.upsertMany(action.activitySearchResultDetailPages, state)
  ),
  on(ActivitySearchResultDetailPageActions.updateActivitySearchResultDetailPage,
    (state, action) => adapter.updateOne(action.activitySearchResultDetailPage, state)
  ),
  on(ActivitySearchResultDetailPageActions.updateActivitySearchResultDetailPages,
    (state, action) => adapter.updateMany(action.activitySearchResultDetailPages, state)
  ),
  on(ActivitySearchResultDetailPageActions.deleteActivitySearchResultDetailPage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivitySearchResultDetailPageActions.deleteActivitySearchResultDetailPages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivitySearchResultDetailPageActions.loadActivitySearchResultDetailPages,
    (state, action) => adapter.addAll(action.activitySearchResultDetailPages, state)
  ),
  on(ActivitySearchResultDetailPageActions.clearActivitySearchResultDetailPages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return activitySearchResultDetailPageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
