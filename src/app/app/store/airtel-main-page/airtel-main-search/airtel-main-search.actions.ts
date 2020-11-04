import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AirtelMainSearch } from './airtel-main-search.model';

export enum AirtelMainSearchActionTypes {
  LoadAirtelMainSearchs = '[AirtelMainSearch] Load AirtelMainSearchs',
  AddAirtelMainSearch = '[AirtelMainSearch] Add AirtelMainSearch',
  UpsertAirtelMainSearch = '[AirtelMainSearch] Upsert AirtelMainSearch',
  AddAirtelMainSearchs = '[AirtelMainSearch] Add AirtelMainSearchs',
  UpsertAirtelMainSearchs = '[AirtelMainSearch] Upsert AirtelMainSearchs',
  UpdateAirtelMainSearch = '[AirtelMainSearch] Update AirtelMainSearch',
  UpdateAirtelMainSearchs = '[AirtelMainSearch] Update AirtelMainSearchs',
  DeleteAirtelMainSearch = '[AirtelMainSearch] Delete AirtelMainSearch',
  DeleteAirtelMainSearchs = '[AirtelMainSearch] Delete AirtelMainSearchs',
  ClearAirtelMainSearchs = '[AirtelMainSearch] Clear AirtelMainSearchs'
}

export class LoadAirtelMainSearchs implements Action {
  readonly type = AirtelMainSearchActionTypes.LoadAirtelMainSearchs;

  constructor(public payload: { airtelMainSearchs: AirtelMainSearch[] }) {}
}

export class AddAirtelMainSearch implements Action {
  readonly type = AirtelMainSearchActionTypes.AddAirtelMainSearch;

  constructor(public payload: { airtelMainSearch: AirtelMainSearch }) {}
}

export class UpsertAirtelMainSearch implements Action {
  readonly type = AirtelMainSearchActionTypes.UpsertAirtelMainSearch;

  constructor(public payload: { airtelMainSearch: AirtelMainSearch }) {}
}

export class AddAirtelMainSearchs implements Action {
  readonly type = AirtelMainSearchActionTypes.AddAirtelMainSearchs;

  constructor(public payload: { airtelMainSearchs: AirtelMainSearch[] }) {}
}

export class UpsertAirtelMainSearchs implements Action {
  readonly type = AirtelMainSearchActionTypes.UpsertAirtelMainSearchs;

  constructor(public payload: { airtelMainSearchs: AirtelMainSearch[] }) {}
}

export class UpdateAirtelMainSearch implements Action {
  readonly type = AirtelMainSearchActionTypes.UpdateAirtelMainSearch;

  constructor(public payload: { airtelMainSearch: Update<AirtelMainSearch> }) {}
}

export class UpdateAirtelMainSearchs implements Action {
  readonly type = AirtelMainSearchActionTypes.UpdateAirtelMainSearchs;

  constructor(public payload: { airtelMainSearchs: Update<AirtelMainSearch>[] }) {}
}

export class DeleteAirtelMainSearch implements Action {
  readonly type = AirtelMainSearchActionTypes.DeleteAirtelMainSearch;

  constructor(public payload: { id: string }) {}
}

export class DeleteAirtelMainSearchs implements Action {
  readonly type = AirtelMainSearchActionTypes.DeleteAirtelMainSearchs;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearAirtelMainSearchs implements Action {
  readonly type = AirtelMainSearchActionTypes.ClearAirtelMainSearchs;
}

export type AirtelMainSearchActions =
 LoadAirtelMainSearchs
 | AddAirtelMainSearch
 | UpsertAirtelMainSearch
 | AddAirtelMainSearchs
 | UpsertAirtelMainSearchs
 | UpdateAirtelMainSearch
 | UpdateAirtelMainSearchs
 | DeleteAirtelMainSearch
 | DeleteAirtelMainSearchs
 | ClearAirtelMainSearchs;
