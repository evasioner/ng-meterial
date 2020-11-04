import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AirtelSearchResultGo } from './airtel-search-result-go.model';

export enum AirtelSearchResultGoActionTypes {
  LoadAirtelSearchResultGos = '[AirtelSearchResultGo] Load AirtelSearchResultGos',
  AddAirtelSearchResultGo = '[AirtelSearchResultGo] Add AirtelSearchResultGo',
  UpsertAirtelSearchResultGo = '[AirtelSearchResultGo] Upsert AirtelSearchResultGo',
  AddAirtelSearchResultGos = '[AirtelSearchResultGo] Add AirtelSearchResultGos',
  UpsertAirtelSearchResultGos = '[AirtelSearchResultGo] Upsert AirtelSearchResultGos',
  UpdateAirtelSearchResultGo = '[AirtelSearchResultGo] Update AirtelSearchResultGo',
  UpdateAirtelSearchResultGos = '[AirtelSearchResultGo] Update AirtelSearchResultGos',
  DeleteAirtelSearchResultGo = '[AirtelSearchResultGo] Delete AirtelSearchResultGo',
  DeleteAirtelSearchResultGos = '[AirtelSearchResultGo] Delete AirtelSearchResultGos',
  ClearAirtelSearchResultGos = '[AirtelSearchResultGo] Clear AirtelSearchResultGos'
}

export class LoadAirtelSearchResultGos implements Action {
  readonly type = AirtelSearchResultGoActionTypes.LoadAirtelSearchResultGos;

  constructor(public payload: { airtelSearchResultGos: AirtelSearchResultGo[] }) {}
}

export class AddAirtelSearchResultGo implements Action {
  readonly type = AirtelSearchResultGoActionTypes.AddAirtelSearchResultGo;

  constructor(public payload: { airtelSearchResultGo: AirtelSearchResultGo }) {}
}

export class UpsertAirtelSearchResultGo implements Action {
  readonly type = AirtelSearchResultGoActionTypes.UpsertAirtelSearchResultGo;

  constructor(public payload: { airtelSearchResultGo: AirtelSearchResultGo }) {}
}

export class AddAirtelSearchResultGos implements Action {
  readonly type = AirtelSearchResultGoActionTypes.AddAirtelSearchResultGos;

  constructor(public payload: { airtelSearchResultGos: AirtelSearchResultGo[] }) {}
}

export class UpsertAirtelSearchResultGos implements Action {
  readonly type = AirtelSearchResultGoActionTypes.UpsertAirtelSearchResultGos;

  constructor(public payload: { airtelSearchResultGos: AirtelSearchResultGo[] }) {}
}

export class UpdateAirtelSearchResultGo implements Action {
  readonly type = AirtelSearchResultGoActionTypes.UpdateAirtelSearchResultGo;

  constructor(public payload: { airtelSearchResultGo: Update<AirtelSearchResultGo> }) {}
}

export class UpdateAirtelSearchResultGos implements Action {
  readonly type = AirtelSearchResultGoActionTypes.UpdateAirtelSearchResultGos;

  constructor(public payload: { airtelSearchResultGos: Update<AirtelSearchResultGo>[] }) {}
}

export class DeleteAirtelSearchResultGo implements Action {
  readonly type = AirtelSearchResultGoActionTypes.DeleteAirtelSearchResultGo;

  constructor(public payload: { id: string }) {}
}

export class DeleteAirtelSearchResultGos implements Action {
  readonly type = AirtelSearchResultGoActionTypes.DeleteAirtelSearchResultGos;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearAirtelSearchResultGos implements Action {
  readonly type = AirtelSearchResultGoActionTypes.ClearAirtelSearchResultGos;
}

export type AirtelSearchResultGoActions =
 LoadAirtelSearchResultGos
 | AddAirtelSearchResultGo
 | UpsertAirtelSearchResultGo
 | AddAirtelSearchResultGos
 | UpsertAirtelSearchResultGos
 | UpdateAirtelSearchResultGo
 | UpdateAirtelSearchResultGos
 | DeleteAirtelSearchResultGo
 | DeleteAirtelSearchResultGos
 | ClearAirtelSearchResultGos;
