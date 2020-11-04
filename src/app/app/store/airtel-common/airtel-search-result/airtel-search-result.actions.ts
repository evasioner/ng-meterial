import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AirtelSearchResult } from './airtel-search-result.model';

export const loadAirtelSearchResults = createAction(
  '[AirtelSearchResult/API] Load AirtelSearchResults', 
  props<{ airtelSearchResults: AirtelSearchResult[] }>()
);

export const addAirtelSearchResult = createAction(
  '[AirtelSearchResult/API] Add AirtelSearchResult',
  props<{ airtelSearchResult: AirtelSearchResult }>()
);

export const upsertAirtelSearchResult = createAction(
  '[AirtelSearchResult/API] Upsert AirtelSearchResult',
  props<{ airtelSearchResult: AirtelSearchResult }>()
);

export const addAirtelSearchResults = createAction(
  '[AirtelSearchResult/API] Add AirtelSearchResults',
  props<{ airtelSearchResults: AirtelSearchResult[] }>()
);

export const upsertAirtelSearchResults = createAction(
  '[AirtelSearchResult/API] Upsert AirtelSearchResults',
  props<{ airtelSearchResults: AirtelSearchResult[] }>()
);

export const updateAirtelSearchResult = createAction(
  '[AirtelSearchResult/API] Update AirtelSearchResult',
  props<{ airtelSearchResult: Update<AirtelSearchResult> }>()
);

export const updateAirtelSearchResults = createAction(
  '[AirtelSearchResult/API] Update AirtelSearchResults',
  props<{ airtelSearchResults: Update<AirtelSearchResult>[] }>()
);

export const deleteAirtelSearchResult = createAction(
  '[AirtelSearchResult/API] Delete AirtelSearchResult',
  props<{ id: string }>()
);

export const deleteAirtelSearchResults = createAction(
  '[AirtelSearchResult/API] Delete AirtelSearchResults',
  props<{ ids: string[] }>()
);

export const clearAirtelSearchResults = createAction(
  '[AirtelSearchResult/API] Clear AirtelSearchResults'
);
