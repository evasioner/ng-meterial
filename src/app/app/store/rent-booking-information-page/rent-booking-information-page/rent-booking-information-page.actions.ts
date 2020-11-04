import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { RentBookingInformationPage } from './rent-booking-information-page.model';

export const loadRentBookingInformationPages = createAction(
  '[RentBookingInformationPage/API] Load RentBookingInformationPages', 
  props<{ rentBookingInformationPages: RentBookingInformationPage[] }>()
);

export const addRentBookingInformationPage = createAction(
  '[RentBookingInformationPage/API] Add RentBookingInformationPage',
  props<{ rentBookingInformationPage: RentBookingInformationPage }>()
);

export const upsertRentBookingInformationPage = createAction(
  '[RentBookingInformationPage/API] Upsert RentBookingInformationPage',
  props<{ rentBookingInformationPage: RentBookingInformationPage }>()
);

export const addRentBookingInformationPages = createAction(
  '[RentBookingInformationPage/API] Add RentBookingInformationPages',
  props<{ rentBookingInformationPages: RentBookingInformationPage[] }>()
);

export const upsertRentBookingInformationPages = createAction(
  '[RentBookingInformationPage/API] Upsert RentBookingInformationPages',
  props<{ rentBookingInformationPages: RentBookingInformationPage[] }>()
);

export const updateRentBookingInformationPage = createAction(
  '[RentBookingInformationPage/API] Update RentBookingInformationPage',
  props<{ rentBookingInformationPage: Update<RentBookingInformationPage> }>()
);

export const updateRentBookingInformationPages = createAction(
  '[RentBookingInformationPage/API] Update RentBookingInformationPages',
  props<{ rentBookingInformationPages: Update<RentBookingInformationPage>[] }>()
);

export const deleteRentBookingInformationPage = createAction(
  '[RentBookingInformationPage/API] Delete RentBookingInformationPage',
  props<{ id: string }>()
);

export const deleteRentBookingInformationPages = createAction(
  '[RentBookingInformationPage/API] Delete RentBookingInformationPages',
  props<{ ids: string[] }>()
);

export const clearRentBookingInformationPages = createAction(
  '[RentBookingInformationPage/API] Clear RentBookingInformationPages'
);
