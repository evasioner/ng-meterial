import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { RentSearchResultDetailPage } from './rent-search-result-detail-page.model';

export const loadRentSearchResultDetailPages = createAction(
  '[RentSearchResultDetailPage/API] Load RentSearchResultDetailPages', 
  props<{ rentSearchResultDetailPages: RentSearchResultDetailPage[] }>()
);

export const addRentSearchResultDetailPage = createAction(
  '[RentSearchResultDetailPage/API] Add RentSearchResultDetailPage',
  props<{ rentSearchResultDetailPage: RentSearchResultDetailPage }>()
);

export const upsertRentSearchResultDetailPage = createAction(
  '[RentSearchResultDetailPage/API] Upsert RentSearchResultDetailPage',
  props<{ rentSearchResultDetailPage: RentSearchResultDetailPage }>()
);

export const addRentSearchResultDetailPages = createAction(
  '[RentSearchResultDetailPage/API] Add RentSearchResultDetailPages',
  props<{ rentSearchResultDetailPages: RentSearchResultDetailPage[] }>()
);

export const upsertRentSearchResultDetailPages = createAction(
  '[RentSearchResultDetailPage/API] Upsert RentSearchResultDetailPages',
  props<{ rentSearchResultDetailPages: RentSearchResultDetailPage[] }>()
);

export const updateRentSearchResultDetailPage = createAction(
  '[RentSearchResultDetailPage/API] Update RentSearchResultDetailPage',
  props<{ rentSearchResultDetailPage: Update<RentSearchResultDetailPage> }>()
);

export const updateRentSearchResultDetailPages = createAction(
  '[RentSearchResultDetailPage/API] Update RentSearchResultDetailPages',
  props<{ rentSearchResultDetailPages: Update<RentSearchResultDetailPage>[] }>()
);

export const deleteRentSearchResultDetailPage = createAction(
  '[RentSearchResultDetailPage/API] Delete RentSearchResultDetailPage',
  props<{ id: string }>()
);

export const deleteRentSearchResultDetailPages = createAction(
  '[RentSearchResultDetailPage/API] Delete RentSearchResultDetailPages',
  props<{ ids: string[] }>()
);

export const clearRentSearchResultDetailPages = createAction(
  '[RentSearchResultDetailPage/API] Clear RentSearchResultDetailPages'
);
