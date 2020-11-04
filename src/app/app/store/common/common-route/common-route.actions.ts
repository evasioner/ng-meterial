import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CommonRoute } from './common-route.model';

export const loadCommonRoutes = createAction(
  '[CommonRoute/API] Load CommonRoutes', 
  props<{ commonRoutes: CommonRoute[] }>()
);

export const addCommonRoute = createAction(
  '[CommonRoute/API] Add CommonRoute',
  props<{ commonRoute: CommonRoute }>()
);

export const upsertCommonRoute = createAction(
  '[CommonRoute/API] Upsert CommonRoute',
  props<{ commonRoute: CommonRoute }>()
);

export const addCommonRoutes = createAction(
  '[CommonRoute/API] Add CommonRoutes',
  props<{ commonRoutes: CommonRoute[] }>()
);

export const upsertCommonRoutes = createAction(
  '[CommonRoute/API] Upsert CommonRoutes',
  props<{ commonRoutes: CommonRoute[] }>()
);

export const updateCommonRoute = createAction(
  '[CommonRoute/API] Update CommonRoute',
  props<{ commonRoute: Update<CommonRoute> }>()
);

export const updateCommonRoutes = createAction(
  '[CommonRoute/API] Update CommonRoutes',
  props<{ commonRoutes: Update<CommonRoute>[] }>()
);

export const deleteCommonRoute = createAction(
  '[CommonRoute/API] Delete CommonRoute',
  props<{ id: string }>()
);

export const deleteCommonRoutes = createAction(
  '[CommonRoute/API] Delete CommonRoutes',
  props<{ ids: string[] }>()
);

export const clearCommonRoutes = createAction(
  '[CommonRoute/API] Clear CommonRoutes'
);
