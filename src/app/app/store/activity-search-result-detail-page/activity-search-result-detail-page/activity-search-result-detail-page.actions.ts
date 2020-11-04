import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivitySearchResultDetailPage } from './activity-search-result-detail-page.model';

export const loadActivitySearchResultDetailPages = createAction(
  '[ActivitySearchResultDetailPage/API] Load ActivitySearchResultDetailPages', 
  props<{ activitySearchResultDetailPages: ActivitySearchResultDetailPage[] }>()
);

export const addActivitySearchResultDetailPage = createAction(
  '[ActivitySearchResultDetailPage/API] Add ActivitySearchResultDetailPage',
  props<{ activitySearchResultDetailPage: ActivitySearchResultDetailPage }>()
);

export const upsertActivitySearchResultDetailPage = createAction(
  '[ActivitySearchResultDetailPage/API] Upsert ActivitySearchResultDetailPage',
  props<{ activitySearchResultDetailPage: ActivitySearchResultDetailPage }>()
);

export const addActivitySearchResultDetailPages = createAction(
  '[ActivitySearchResultDetailPage/API] Add ActivitySearchResultDetailPages',
  props<{ activitySearchResultDetailPages: ActivitySearchResultDetailPage[] }>()
);

export const upsertActivitySearchResultDetailPages = createAction(
  '[ActivitySearchResultDetailPage/API] Upsert ActivitySearchResultDetailPages',
  props<{ activitySearchResultDetailPages: ActivitySearchResultDetailPage[] }>()
);

export const updateActivitySearchResultDetailPage = createAction(
  '[ActivitySearchResultDetailPage/API] Update ActivitySearchResultDetailPage',
  props<{ activitySearchResultDetailPage: Update<ActivitySearchResultDetailPage> }>()
);

export const updateActivitySearchResultDetailPages = createAction(
  '[ActivitySearchResultDetailPage/API] Update ActivitySearchResultDetailPages',
  props<{ activitySearchResultDetailPages: Update<ActivitySearchResultDetailPage>[] }>()
);

export const deleteActivitySearchResultDetailPage = createAction(
  '[ActivitySearchResultDetailPage/API] Delete ActivitySearchResultDetailPage',
  props<{ id: string }>()
);

export const deleteActivitySearchResultDetailPages = createAction(
  '[ActivitySearchResultDetailPage/API] Delete ActivitySearchResultDetailPages',
  props<{ ids: string[] }>()
);

export const clearActivitySearchResultDetailPages = createAction(
  '[ActivitySearchResultDetailPage/API] Clear ActivitySearchResultDetailPages'
);
