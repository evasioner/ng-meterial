import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivitySearchResultOptionPage } from './activity-search-result-option-page.model';

export const loadActivitySearchResultOptionPages = createAction(
  '[ActivitySearchResultOptionPage/API] Load ActivitySearchResultOptionPages', 
  props<{ activitySearchResultOptionPages: ActivitySearchResultOptionPage[] }>()
);

export const addActivitySearchResultOptionPage = createAction(
  '[ActivitySearchResultOptionPage/API] Add ActivitySearchResultOptionPage',
  props<{ activitySearchResultOptionPage: ActivitySearchResultOptionPage }>()
);

export const upsertActivitySearchResultOptionPage = createAction(
  '[ActivitySearchResultOptionPage/API] Upsert ActivitySearchResultOptionPage',
  props<{ activitySearchResultOptionPage: ActivitySearchResultOptionPage }>()
);

export const addActivitySearchResultOptionPages = createAction(
  '[ActivitySearchResultOptionPage/API] Add ActivitySearchResultOptionPages',
  props<{ activitySearchResultOptionPages: ActivitySearchResultOptionPage[] }>()
);

export const upsertActivitySearchResultOptionPages = createAction(
  '[ActivitySearchResultOptionPage/API] Upsert ActivitySearchResultOptionPages',
  props<{ activitySearchResultOptionPages: ActivitySearchResultOptionPage[] }>()
);

export const updateActivitySearchResultOptionPage = createAction(
  '[ActivitySearchResultOptionPage/API] Update ActivitySearchResultOptionPage',
  props<{ activitySearchResultOptionPage: Update<ActivitySearchResultOptionPage> }>()
);

export const updateActivitySearchResultOptionPages = createAction(
  '[ActivitySearchResultOptionPage/API] Update ActivitySearchResultOptionPages',
  props<{ activitySearchResultOptionPages: Update<ActivitySearchResultOptionPage>[] }>()
);

export const deleteActivitySearchResultOptionPage = createAction(
  '[ActivitySearchResultOptionPage/API] Delete ActivitySearchResultOptionPage',
  props<{ id: string }>()
);

export const deleteActivitySearchResultOptionPages = createAction(
  '[ActivitySearchResultOptionPage/API] Delete ActivitySearchResultOptionPages',
  props<{ ids: string[] }>()
);

export const clearActivitySearchResultOptionPages = createAction(
  '[ActivitySearchResultOptionPage/API] Clear ActivitySearchResultOptionPages'
);
