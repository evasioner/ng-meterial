import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivityResultSearch } from './activity-result-search.model';

export const loadActivityResultSearchs = createAction(
  '[ActivityResultSearch/API] Load ActivityResultSearchs', 
  props<{ activityResultSearchs: ActivityResultSearch[] }>()
);

export const addActivityResultSearch = createAction(
  '[ActivityResultSearch/API] Add ActivityResultSearch',
  props<{ activityResultSearch: ActivityResultSearch }>()
);

export const upsertActivityResultSearch = createAction(
  '[ActivityResultSearch/API] Upsert ActivityResultSearch',
  props<{ activityResultSearch: ActivityResultSearch }>()
);

export const addActivityResultSearchs = createAction(
  '[ActivityResultSearch/API] Add ActivityResultSearchs',
  props<{ activityResultSearchs: ActivityResultSearch[] }>()
);

export const upsertActivityResultSearchs = createAction(
  '[ActivityResultSearch/API] Upsert ActivityResultSearchs',
  props<{ activityResultSearchs: ActivityResultSearch[] }>()
);

export const updateActivityResultSearch = createAction(
  '[ActivityResultSearch/API] Update ActivityResultSearch',
  props<{ activityResultSearch: Update<ActivityResultSearch> }>()
);

export const updateActivityResultSearchs = createAction(
  '[ActivityResultSearch/API] Update ActivityResultSearchs',
  props<{ activityResultSearchs: Update<ActivityResultSearch>[] }>()
);

export const deleteActivityResultSearch = createAction(
  '[ActivityResultSearch/API] Delete ActivityResultSearch',
  props<{ id: string }>()
);

export const deleteActivityResultSearchs = createAction(
  '[ActivityResultSearch/API] Delete ActivityResultSearchs',
  props<{ ids: string[] }>()
);

export const clearActivityResultSearchs = createAction(
  '[ActivityResultSearch/API] Clear ActivityResultSearchs'
);
