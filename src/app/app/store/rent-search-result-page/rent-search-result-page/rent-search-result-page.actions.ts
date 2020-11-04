import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { RentSearchResultPage } from './rent-search-result-page.model';

export const loadRentSearchResultPages = createAction(
  '[RentSearchResultPage/API] Load RentSearchResultPages', 
  props<{ rentSearchResultPages: RentSearchResultPage[] }>()
);

export const addRentSearchResultPage = createAction(
  '[RentSearchResultPage/API] Add RentSearchResultPage',
  props<{ rentSearchResultPage: RentSearchResultPage }>()
);

export const upsertRentSearchResultPage = createAction(
  '[RentSearchResultPage/API] Upsert RentSearchResultPage',
  props<{ rentSearchResultPage: RentSearchResultPage }>()
);

export const addRentSearchResultPages = createAction(
  '[RentSearchResultPage/API] Add RentSearchResultPages',
  props<{ rentSearchResultPages: RentSearchResultPage[] }>()
);

export const upsertRentSearchResultPages = createAction(
  '[RentSearchResultPage/API] Upsert RentSearchResultPages',
  props<{ rentSearchResultPages: RentSearchResultPage[] }>()
);

export const updateRentSearchResultPage = createAction(
  '[RentSearchResultPage/API] Update RentSearchResultPage',
  props<{ rentSearchResultPage: Update<RentSearchResultPage> }>()
);

export const updateRentSearchResultPages = createAction(
  '[RentSearchResultPage/API] Update RentSearchResultPages',
  props<{ rentSearchResultPages: Update<RentSearchResultPage>[] }>()
);

export const deleteRentSearchResultPage = createAction(
  '[RentSearchResultPage/API] Delete RentSearchResultPage',
  props<{ id: string }>()
);

export const deleteRentSearchResultPages = createAction(
  '[RentSearchResultPage/API] Delete RentSearchResultPages',
  props<{ ids: string[] }>()
);

export const clearRentSearchResultPages = createAction(
  '[RentSearchResultPage/API] Clear RentSearchResultPages'
);
