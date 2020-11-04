import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivityCitySearch } from './activity-city-search.model';

export const loadActivityCitySearchs = createAction(
    '[ActivityCitySearch/API] Load ActivityCitySearchs',
    props<{ activityCitySearchs: ActivityCitySearch[] }>()
);

export const addActivityCitySearch = createAction(
    '[ActivityCitySearch/API] Add ActivityCitySearch',
    props<{ activityCitySearch: ActivityCitySearch }>()
);

export const upsertActivityCitySearch = createAction(
    '[ActivityCitySearch/API] Upsert ActivityCitySearch',
    props<{ activityCitySearch: ActivityCitySearch }>()
);

export const addActivityCitySearchs = createAction(
    '[ActivityCitySearch/API] Add ActivityCitySearchs',
    props<{ activityCitySearchs: ActivityCitySearch[] }>()
);

export const upsertActivityCitySearchs = createAction(
    '[ActivityCitySearch/API] Upsert ActivityCitySearchs',
    props<{ activityCitySearchs: ActivityCitySearch[] }>()
);

export const updateActivityCitySearch = createAction(
    '[ActivityCitySearch/API] Update ActivityCitySearch',
    props<{ activityCitySearch: Update<ActivityCitySearch> }>()
);

export const updateActivityCitySearchs = createAction(
    '[ActivityCitySearch/API] Update ActivityCitySearchs',
    props<{ activityCitySearchs: Update<ActivityCitySearch>[] }>()
);

export const deleteActivityCitySearch = createAction(
    '[ActivityCitySearch/API] Delete ActivityCitySearch',
    props<{ id: string }>()
);

export const deleteActivityCitySearchs = createAction(
    '[ActivityCitySearch/API] Delete ActivityCitySearchs',
    props<{ ids: string[] }>()
);

export const clearActivityCitySearchs = createAction(
    '[ActivityCitySearch/API] Clear ActivityCitySearchs'
);
