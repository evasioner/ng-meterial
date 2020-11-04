import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivityMainSearch } from './activity-main-search.model';

export const loadActivityMainSearchs = createAction(
  '[ActivityMainSearch/API] Load ActivityMainSearchs', 
  props<{ activityMainSearchs: ActivityMainSearch[] }>()
);

export const addActivityMainSearch = createAction(
  '[ActivityMainSearch/API] Add ActivityMainSearch',
  props<{ activityMainSearch: ActivityMainSearch }>()
);

export const upsertActivityMainSearch = createAction(
  '[ActivityMainSearch/API] Upsert ActivityMainSearch',
  props<{ activityMainSearch: ActivityMainSearch }>()
);

export const addActivityMainSearchs = createAction(
  '[ActivityMainSearch/API] Add ActivityMainSearchs',
  props<{ activityMainSearchs: ActivityMainSearch[] }>()
);

export const upsertActivityMainSearchs = createAction(
  '[ActivityMainSearch/API] Upsert ActivityMainSearchs',
  props<{ activityMainSearchs: ActivityMainSearch[] }>()
);

export const updateActivityMainSearch = createAction(
  '[ActivityMainSearch/API] Update ActivityMainSearch',
  props<{ activityMainSearch: Update<ActivityMainSearch> }>()
);

export const updateActivityMainSearchs = createAction(
  '[ActivityMainSearch/API] Update ActivityMainSearchs',
  props<{ activityMainSearchs: Update<ActivityMainSearch>[] }>()
);

export const deleteActivityMainSearch = createAction(
  '[ActivityMainSearch/API] Delete ActivityMainSearch',
  props<{ id: string }>()
);

export const deleteActivityMainSearchs = createAction(
  '[ActivityMainSearch/API] Delete ActivityMainSearchs',
  props<{ ids: string[] }>()
);

export const clearActivityMainSearchs = createAction(
  '[ActivityMainSearch/API] Clear ActivityMainSearchs'
);
