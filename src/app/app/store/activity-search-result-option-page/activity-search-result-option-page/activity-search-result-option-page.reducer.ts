import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActivitySearchResultOptionPage } from './activity-search-result-option-page.model';
import * as ActivitySearchResultOptionPageActions from './activity-search-result-option-page.actions';

export const activitySearchResultOptionPagesFeatureKey = 'activitySearchResultOptionPages';

export interface State extends EntityState<ActivitySearchResultOptionPage> {
  // additional entities state properties
}

export const adapter: EntityAdapter<ActivitySearchResultOptionPage> = createEntityAdapter<ActivitySearchResultOptionPage>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

const activitySearchResultOptionPageReducer = createReducer(
  initialState,
  on(ActivitySearchResultOptionPageActions.addActivitySearchResultOptionPage,
    (state, action) => adapter.addOne(action.activitySearchResultOptionPage, state)
  ),
  on(ActivitySearchResultOptionPageActions.upsertActivitySearchResultOptionPage,
    (state, action) => adapter.upsertOne(action.activitySearchResultOptionPage, state)
  ),
  on(ActivitySearchResultOptionPageActions.addActivitySearchResultOptionPages,
    (state, action) => adapter.addMany(action.activitySearchResultOptionPages, state)
  ),
  on(ActivitySearchResultOptionPageActions.upsertActivitySearchResultOptionPages,
    (state, action) => adapter.upsertMany(action.activitySearchResultOptionPages, state)
  ),
  on(ActivitySearchResultOptionPageActions.updateActivitySearchResultOptionPage,
    (state, action) => adapter.updateOne(action.activitySearchResultOptionPage, state)
  ),
  on(ActivitySearchResultOptionPageActions.updateActivitySearchResultOptionPages,
    (state, action) => adapter.updateMany(action.activitySearchResultOptionPages, state)
  ),
  on(ActivitySearchResultOptionPageActions.deleteActivitySearchResultOptionPage,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ActivitySearchResultOptionPageActions.deleteActivitySearchResultOptionPages,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ActivitySearchResultOptionPageActions.loadActivitySearchResultOptionPages,
    (state, action) => adapter.addAll(action.activitySearchResultOptionPages, state)
  ),
  on(ActivitySearchResultOptionPageActions.clearActivitySearchResultOptionPages,
    state => adapter.removeAll(state)
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return activitySearchResultOptionPageReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
