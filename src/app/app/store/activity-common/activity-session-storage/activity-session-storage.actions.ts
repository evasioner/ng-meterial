import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivitySessionStorage } from './activity-session-storage.model';

export const loadActivitySessionStorages = createAction(
    '[ActivitySessionStorage/API] Load ActivitySessionStorages',
    props<{ activitySessionStorages: ActivitySessionStorage[] }>()
);

export const addActivitySessionStorage = createAction(
    '[ActivitySessionStorage/API] Add ActivitySessionStorage',
    props<{ activitySessionStorage: ActivitySessionStorage }>()
);

export const upsertActivitySessionStorage = createAction(
    '[ActivitySessionStorage/API] Upsert ActivitySessionStorage',
    props<{ activitySessionStorage: ActivitySessionStorage }>()
);

export const addActivitySessionStorages = createAction(
    '[ActivitySessionStorage/API] Add ActivitySessionStorages',
    props<{ activitySessionStorages: ActivitySessionStorage[] }>()
);

export const upsertActivitySessionStorages = createAction(
    '[ActivitySessionStorage/API] Upsert ActivitySessionStorages',
    props<{ activitySessionStorages: ActivitySessionStorage[] }>()
);

export const updateActivitySessionStorage = createAction(
    '[ActivitySessionStorage/API] Update ActivitySessionStorage',
    props<{ activitySessionStorage: Update<ActivitySessionStorage> }>()
);

export const updateActivitySessionStorages = createAction(
    '[ActivitySessionStorage/API] Update ActivitySessionStorages',
    props<{ activitySessionStorages: Update<ActivitySessionStorage>[] }>()
);

export const deleteActivitySessionStorage = createAction(
    '[ActivitySessionStorage/API] Delete ActivitySessionStorage',
    props<{ id: string }>()
);

export const deleteActivitySessionStorages = createAction(
    '[ActivitySessionStorage/API] Delete ActivitySessionStorages',
    props<{ ids: string[] }>()
);

export const clearActivitySessionStorages = createAction(
    '[ActivitySessionStorage/API] Clear ActivitySessionStorages'
);
