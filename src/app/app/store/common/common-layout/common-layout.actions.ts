import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CommonLayout } from './common-layout.model';

export const loadCommonLayouts = createAction(
    '[CommonLayout/API] Load CommonLayouts',
    props<{ commonLayouts: CommonLayout[] }>()
);

export const addCommonLayout = createAction(
    '[CommonLayout/API] Add CommonLayout',
    props<{ commonLayout: CommonLayout }>()
);

export const upsertCommonLayout = createAction(
    '[CommonLayout/API] Upsert CommonLayout',
    props<{ commonLayout: CommonLayout }>()
);

export const addCommonLayouts = createAction(
    '[CommonLayout/API] Add CommonLayouts',
    props<{ commonLayouts: CommonLayout[] }>()
);

export const upsertCommonLayouts = createAction(
    '[CommonLayout/API] Upsert CommonLayouts',
    props<{ commonLayouts: CommonLayout[] }>()
);

export const updateCommonLayout = createAction(
    '[CommonLayout/API] Update CommonLayout',
    props<{ commonLayout: Update<CommonLayout> }>()
);

export const updateCommonLayouts = createAction(
    '[CommonLayout/API] Update CommonLayouts',
    props<{ commonLayouts: Update<CommonLayout>[] }>()
);

export const deleteCommonLayout = createAction(
    '[CommonLayout/API] Delete CommonLayout',
    props<{ id: string }>()
);

export const deleteCommonLayouts = createAction(
    '[CommonLayout/API] Delete CommonLayouts',
    props<{ ids: string[] }>()
);

export const clearCommonLayouts = createAction(
    '[CommonLayout/API] Clear CommonLayouts'
);
