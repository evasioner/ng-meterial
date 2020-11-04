import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AirtelResultSearch } from './airtel-result-main-search.model';

export const loadAirtelResultMainSearchs = createAction(
  '[AirtelResultMainSearch/API] Load AirtelResultMainSearchs',
  props<{ airtelResultMainSearchs: AirtelResultSearch[] }>()
);

export const addAirtelResultMainSearch = createAction(
  '[AirtelResultMainSearch/API] Add AirtelResultMainSearch',
  props<{ airtelResultMainSearch: AirtelResultSearch }>()
);

export const upsertAirtelResultMainSearch = createAction(
  '[AirtelResultMainSearch/API] Upsert AirtelResultMainSearch',
  props<{ airtelResultMainSearch: AirtelResultSearch }>()
);

export const addAirtelResultMainSearchs = createAction(
  '[AirtelResultMainSearch/API] Add AirtelResultMainSearchs',
  props<{ airtelResultMainSearchs: AirtelResultSearch[] }>()
);

export const upsertAirtelResultMainSearchs = createAction(
  '[AirtelResultMainSearch/API] Upsert AirtelResultMainSearchs',
  props<{ airtelResultMainSearchs: AirtelResultSearch[] }>()
);

export const updateAirtelResultMainSearch = createAction(
  '[AirtelResultMainSearch/API] Update AirtelResultMainSearch',
  props<{ airtelResultMainSearch: Update<AirtelResultSearch> }>()
);

export const updateAirtelResultMainSearchs = createAction(
  '[AirtelResultMainSearch/API] Update AirtelResultMainSearchs',
  props<{ airtelResultMainSearchs: Update<AirtelResultSearch>[] }>()
);

export const deleteAirtelResultMainSearch = createAction(
  '[AirtelResultMainSearch/API] Delete AirtelResultMainSearch',
  props<{ id: string }>()
);

export const deleteAirtelResultMainSearchs = createAction(
  '[AirtelResultMainSearch/API] Delete AirtelResultMainSearchs',
  props<{ ids: string[] }>()
);

export const clearAirtelResultMainSearchs = createAction(
  '[AirtelResultMainSearch/API] Clear AirtelResultMainSearchs'
);
