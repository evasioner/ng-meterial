import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { ActivityBookingInformationPage } from './activity-booking-information-page.model';

export const loadActivityBookingInformationPages = createAction(
  '[ActivityBookingInformationPage/API] Load ActivityBookingInformationPages', 
  props<{ activityBookingInformationPages: ActivityBookingInformationPage[] }>()
);

export const addActivityBookingInformationPage = createAction(
  '[ActivityBookingInformationPage/API] Add ActivityBookingInformationPage',
  props<{ activityBookingInformationPage: ActivityBookingInformationPage }>()
);

export const upsertActivityBookingInformationPage = createAction(
  '[ActivityBookingInformationPage/API] Upsert ActivityBookingInformationPage',
  props<{ activityBookingInformationPage: ActivityBookingInformationPage }>()
);

export const addActivityBookingInformationPages = createAction(
  '[ActivityBookingInformationPage/API] Add ActivityBookingInformationPages',
  props<{ activityBookingInformationPages: ActivityBookingInformationPage[] }>()
);

export const upsertActivityBookingInformationPages = createAction(
  '[ActivityBookingInformationPage/API] Upsert ActivityBookingInformationPages',
  props<{ activityBookingInformationPages: ActivityBookingInformationPage[] }>()
);

export const updateActivityBookingInformationPage = createAction(
  '[ActivityBookingInformationPage/API] Update ActivityBookingInformationPage',
  props<{ activityBookingInformationPage: Update<ActivityBookingInformationPage> }>()
);

export const updateActivityBookingInformationPages = createAction(
  '[ActivityBookingInformationPage/API] Update ActivityBookingInformationPages',
  props<{ activityBookingInformationPages: Update<ActivityBookingInformationPage>[] }>()
);

export const deleteActivityBookingInformationPage = createAction(
  '[ActivityBookingInformationPage/API] Delete ActivityBookingInformationPage',
  props<{ id: string }>()
);

export const deleteActivityBookingInformationPages = createAction(
  '[ActivityBookingInformationPage/API] Delete ActivityBookingInformationPages',
  props<{ ids: string[] }>()
);

export const clearActivityBookingInformationPages = createAction(
  '[ActivityBookingInformationPage/API] Clear ActivityBookingInformationPages'
);
