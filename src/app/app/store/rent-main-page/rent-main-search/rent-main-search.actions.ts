import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { RentMainSearch } from './rent-main-search.model';

export const loadRentMainSearchs = createAction(
  '[RentMainSearch/API] Load RentMainSearchs', 
  props<{ rentMainSearchs: RentMainSearch[] }>()
);

export const addRentMainSearch = createAction(
  '[RentMainSearch/API] Add RentMainSearch',
  props<{ rentMainSearch: RentMainSearch }>()
);

export const upsertRentMainSearch = createAction(
  '[RentMainSearch/API] Upsert RentMainSearch',
  props<{ rentMainSearch: RentMainSearch }>()
);

export const addRentMainSearchs = createAction(
  '[RentMainSearch/API] Add RentMainSearchs',
  props<{ rentMainSearchs: RentMainSearch[] }>()
);

export const upsertRentMainSearchs = createAction(
  '[RentMainSearch/API] Upsert RentMainSearchs',
  props<{ rentMainSearchs: RentMainSearch[] }>()
);

export const updateRentMainSearch = createAction(
  '[RentMainSearch/API] Update RentMainSearch',
  props<{ rentMainSearch: Update<RentMainSearch> }>()
);

export const updateRentMainSearchs = createAction(
  '[RentMainSearch/API] Update RentMainSearchs',
  props<{ rentMainSearchs: Update<RentMainSearch>[] }>()
);

export const deleteRentMainSearch = createAction(
  '[RentMainSearch/API] Delete RentMainSearch',
  props<{ id: string }>()
);

export const deleteRentMainSearchs = createAction(
  '[RentMainSearch/API] Delete RentMainSearchs',
  props<{ ids: string[] }>()
);

export const clearRentMainSearchs = createAction(
  '[RentMainSearch/API] Clear RentMainSearchs'
);
