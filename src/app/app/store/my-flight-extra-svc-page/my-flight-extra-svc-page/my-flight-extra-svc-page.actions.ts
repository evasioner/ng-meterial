import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { MyFlightExtraSvcPage } from './my-flight-extra-svc-page.model';

export const loadMyFlightExtraSvcPages = createAction(
  '[MyFlightExtraSvcPage/API] Load MyFlightExtraSvcPages', 
  props<{ myFlightExtraSvcPages: MyFlightExtraSvcPage[] }>()
);

export const addMyFlightExtraSvcPage = createAction(
  '[MyFlightExtraSvcPage/API] Add MyFlightExtraSvcPage',
  props<{ myFlightExtraSvcPage: MyFlightExtraSvcPage }>()
);

export const upsertMyFlightExtraSvcPage = createAction(
  '[MyFlightExtraSvcPage/API] Upsert MyFlightExtraSvcPage',
  props<{ myFlightExtraSvcPage: MyFlightExtraSvcPage }>()
);

export const addMyFlightExtraSvcPages = createAction(
  '[MyFlightExtraSvcPage/API] Add MyFlightExtraSvcPages',
  props<{ myFlightExtraSvcPages: MyFlightExtraSvcPage[] }>()
);

export const upsertMyFlightExtraSvcPages = createAction(
  '[MyFlightExtraSvcPage/API] Upsert MyFlightExtraSvcPages',
  props<{ myFlightExtraSvcPages: MyFlightExtraSvcPage[] }>()
);

export const updateMyFlightExtraSvcPage = createAction(
  '[MyFlightExtraSvcPage/API] Update MyFlightExtraSvcPage',
  props<{ myFlightExtraSvcPage: Update<MyFlightExtraSvcPage> }>()
);

export const updateMyFlightExtraSvcPages = createAction(
  '[MyFlightExtraSvcPage/API] Update MyFlightExtraSvcPages',
  props<{ myFlightExtraSvcPages: Update<MyFlightExtraSvcPage>[] }>()
);

export const deleteMyFlightExtraSvcPage = createAction(
  '[MyFlightExtraSvcPage/API] Delete MyFlightExtraSvcPage',
  props<{ id: string }>()
);

export const deleteMyFlightExtraSvcPages = createAction(
  '[MyFlightExtraSvcPage/API] Delete MyFlightExtraSvcPages',
  props<{ ids: string[] }>()
);

export const clearMyFlightExtraSvcPages = createAction(
  '[MyFlightExtraSvcPage/API] Clear MyFlightExtraSvcPages'
);
